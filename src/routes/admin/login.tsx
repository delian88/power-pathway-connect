import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import bcrypt from "bcrypt";
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

export const loginFn = createServerFn("POST", async (data: z.infer<typeof loginSchema>) => {
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { email, password } = parsed.data;

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  await createSession(user.id, user.email, user.role);
  return { success: true };
});

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginFn({ email, password });
      toast.success("Login successful");
      navigate({ to: "/admin" });
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
          <h1 className="text-2xl font-bold text-center mb-6 text-[#263566]">Admin Login</h1>
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
                placeholder="admin@example.com"
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
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
