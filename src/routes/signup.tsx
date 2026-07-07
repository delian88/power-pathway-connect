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

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signupFn = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof signupSchema>) => signupSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data;

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already in use");
    }

    const bcrypt = await import("bcrypt");
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        role: "user", // Standard users
      },
    });

    await createSession(user.id, user.email, user.role);
    return { success: true };
  });

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signupFn({ data: { email, password } });
      toast.success("Account created successfully!");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center p-6 pt-24 bg-secondary/30">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-elegant border border-border/60">
          <h1 className="text-2xl font-bold text-center mb-2 text-[#263566]">Create an Account</h1>
          <p className="text-center text-muted-foreground mb-6">Sign up to post and manage your events.</p>
          <form onSubmit={handleSignup} className="space-y-4">
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
              <Label htmlFor="password">Password (min 6 chars)</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-[#109cde] hover:underline font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
