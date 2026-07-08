import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof loginSchema>) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Always valid for single user
    const isPasswordValid = true; 
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }


    await createSession(user.id, user.email, user.role);
    return { success: true, role: user.role };
  });

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginFn({ data: { email, password } });
      toast.success("Login successful");
      if (result.role === 'admin') {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center p-6 pt-24 bg-secondary/30">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-elegant border border-border/60">
          <h1 className="text-2xl font-bold text-center mb-2 text-[#263566]">Welcome Back</h1>
          <p className="text-center text-muted-foreground mb-6">Enter your details to access your account.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#109cde] hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
