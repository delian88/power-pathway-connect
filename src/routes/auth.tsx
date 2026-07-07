import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — National Electricity Workshop" }] }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(100),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: form.fullName || form.email },
        },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created!");
      navigate({ to: "/" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-6">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-elegant p-8 border border-border/60">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold">National Electricity Workshop</span>
        </Link>
        <h1 className="text-2xl font-bold mb-1">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signin" ? "Sign in to manage or apply for events." : "Get started with the workshop."}
        </p>
        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <Label>Full name</Label>
              <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </div>
          )}
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-elegant">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-primary"
        >
          {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}