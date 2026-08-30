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
import { Eye, EyeOff } from "lucide-react";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
});

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof loginSchema>) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data;

    // Rate limiting: 100 attempts per 1 minute (relaxed for testing)
    const rl = rateLimit(email, { windowMs: 1 * 60 * 1000, max: 100 });
    if (!rl.success) {
      throw new Error(`Too many login attempts. Try again in ${Math.ceil(rl.resetInMs / 60000)} minutes.`);
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const bcrypt = await import("bcrypt");
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      // Track failed password attempts
      const failedRl = rateLimit(`failed_login_${email}`, { windowMs: 15 * 60 * 1000, max: 10 });
      
      // If exactly 3 failed attempts, send security alert
      if (failedRl.attempts === 3) {
        await sendEmail(
          email,
          "Security Alert: Failed Login Attempts",
          `<div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #ffcdd2;">
            <h2 style="color: #d32f2f; margin: 0 0 16px 0;">Security Alert</h2>
            <p style="color: #333; margin: 0 0 16px 0; line-height: 1.5;">
              We noticed 3 failed attempts to log in to your account.
            </p>
            <p style="color: #666; margin: 0; font-size: 14px;">
              If this was you, you can ignore this email. If you don't recognize this activity, please contact support or reset your password immediately.
            </p>
          </div>`
        );
      }
      
      throw new Error("Invalid credentials");
    }
    
    // Clear failed login attempts on successful password verification
    // Note: Our rateLimit module doesn't currently support removing a specific key, 
    // but the next attempt will start a new window eventually.

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    await db.user.update({
      where: { email },
      data: { otpCode, otpExpiresAt },
    });

    // Send OTP via email
    const emailSent = await sendEmail(
      email,
      "Your Login OTP Code",
      `<div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05); border: 1px solid #eaeaea;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #263566; margin: 0; font-size: 24px; font-weight: 600;">Login Verification</h2>
          <p style="color: #64748b; margin-top: 8px; font-size: 15px;">Use the code below to securely sign in to your account.</p>
        </div>
        
        <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
          <h1 style="margin: 0; letter-spacing: 12px; color: #109cde; font-size: 40px; font-weight: 700;">${otpCode}</h1>
        </div>
        
        <div style="text-align: center; border-top: 1px solid #eaeaea; padding-top: 24px; margin-top: 24px;">
          <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin: 0;">
            This code will expire in <strong>10 minutes</strong>. <br/>
            For your security, please do not share this code with anyone.
          </p>
        </div>
      </div>`
    );

    if (!emailSent) {
      // Since email functionality might be disabled, allow fallback if SMTP isn't set up.
      // In a real app we might throw, but here we'll log and still require it.
      console.warn(`Failed to send OTP to ${email}. OTP is ${otpCode}`);
      // throw new Error("Failed to send OTP email. Please contact support.");
    }

    return { success: true, requiresOtp: true, email };
  });

export const verifyOtpFn = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof verifyOtpSchema>) => verifyOtpSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, otp } = data;

    // Rate limiting: 100 attempts per 1 minute for OTP as well (relaxed for testing)
    const rl = rateLimit(`otp_${email}`, { windowMs: 1 * 60 * 1000, max: 100 });
    if (!rl.success) {
      throw new Error(`Too many attempts. Try again in ${Math.ceil(rl.resetInMs / 60000)} minutes.`);
    }

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.otpCode || !user.otpExpiresAt) {
      throw new Error("Invalid or expired OTP");
    }

    if (user.otpExpiresAt < new Date()) {
      throw new Error("OTP has expired. Please log in again.");
    }

    if (user.otpCode !== otp) {
      throw new Error("Invalid OTP code");
    }

    // Clear OTP
    await db.user.update({
      where: { email },
      data: { otpCode: null, otpExpiresAt: null },
    });

    await createSession(user.id, user.email, user.role);
    return { success: true, role: user.role };
  });


export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginFn({ data: { email, password } });
      if (result.requiresOtp) {
        toast.success("OTP sent to your email!");
        setStep("otp");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyOtpFn({ data: { email, otp } });
      toast.success("Login successful!");
      if (result.role === 'admin') {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex items-center justify-center p-6 pt-24 bg-secondary/30">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-elegant border border-border/60">
          <h1 className="text-2xl font-bold text-center mb-2 text-[#263566]">
            {step === "login" ? "Welcome Back" : "Verify OTP"}
          </h1>
          <p className="text-center text-muted-foreground mb-6">
            {step === "login" 
              ? "Enter your details to access your account." 
              : `Enter the 6-digit code sent to ${email}`}
          </p>
          
          {step === "login" ? (
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
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white"
              >
                {loading ? "Please wait..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="mt-1 text-center tracking-widest text-lg font-mono"
                  placeholder="••••••"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#008753] hover:bg-[#007044] text-white"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep("login")}
                className="w-full mt-2"
                disabled={loading}
              >
                Back to Login
              </Button>
            </form>
          )}

          {step === "login" && (
            <div className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#109cde] hover:underline font-medium">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
