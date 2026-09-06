"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  User,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeAmbientCanvas from "@/components/ThreeAmbientCanvas";
import ScrambleHeading from "@/components/ScrambleHeading";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/overview";
  const { user, isAuthenticated, login, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isAuthenticated) {
      router.replace(redirectUrl);
    }
  }, [isLoaded, isAuthenticated, redirectUrl, router]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage(null);

    const cleanUsername = username.trim().replace(/^@/, "") || "director";
    const userEmail = email.trim() || `${cleanUsername}@framezero.ai`;
    login(cleanUsername, userEmail, cleanUsername);

    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage(
        mode === "signin"
          ? `Welcome back @${cleanUsername}! Launching FrameZero Homepage...`
          : `Account @${cleanUsername} created! Launching FrameZero Homepage...`
      );
      setTimeout(() => {
        router.push(redirectUrl);
      }, 400);
    }, 500);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    login("demo_director", "demo.director@framezero.ai", "Demo Director");
    setSuccessMessage("Entering as @demo_director... Launching FrameZero Homepage!");
    setTimeout(() => {
      router.push(redirectUrl);
    }, 400);
  };

  if (isLoaded && isAuthenticated) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between selection:bg-accent-amber/30 selection:text-text-primary bg-bg text-text-primary overflow-hidden">
        <ThreeAmbientCanvas />
        <Navbar />
        <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-8 text-center">
          <div className="p-8 rounded-2xl bg-surface/85 backdrop-blur-xl border border-accent-teal-bright/40 shadow-2xl max-w-md w-full space-y-4">
            <div className="w-10 h-10 rounded-full bg-accent-teal-bright/15 border border-accent-teal-bright/40 flex items-center justify-center mx-auto text-accent-teal-bright animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display text-lg text-text-primary">Director Active: @{user?.username}</h2>
              <p className="font-mono text-xs text-accent-teal-bright">Redirecting to FrameZero Homepage...</p>
            </div>
            <Link
              href={redirectUrl}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 transition-all"
            >
              <span>Click here if not redirected</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between selection:bg-accent-amber/30 selection:text-text-primary bg-bg text-text-primary overflow-hidden">
      {/* 1. Ambient Three.js Background (No solid 3D objects) */}
      <ThreeAmbientCanvas />

      {/* 2. Top Navigation */}
      <Navbar />

      {/* 3. Main Stage */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 sm:px-8">
        <div className="w-full max-w-lg flex flex-col items-center space-y-6 text-center">
          {/* Scramble Heading with 3D depth zoom-out on hover */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <ScrambleHeading text="FRAMEZERO" />

            <p className="font-body text-xs sm:text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              Sign in to unlock autonomous commercial synthesis and render broadcast-quality 9:16 video ads.
            </p>
          </div>

          {/* Clean Glassmorphic Login Card */}
          <div className="w-full p-6 sm:p-8 rounded-2xl bg-surface/85 backdrop-blur-xl border border-accent-amber/30 shadow-2xl space-y-5 text-left relative overflow-hidden">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-lg bg-bg border border-text-muted/20 font-mono text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-md transition-all font-medium text-center ${
                  mode === "signin"
                    ? "bg-surface text-accent-amber border border-accent-amber/30 shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-md transition-all font-medium text-center ${
                  mode === "signup"
                    ? "bg-surface text-accent-amber border border-accent-amber/30 shadow-sm"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Success Toast */}
            {successMessage && (
              <div className="p-3 rounded-lg bg-accent-teal-bright/10 border border-accent-teal-bright/40 text-accent-teal-bright font-mono text-xs flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-username"
                  className="block font-mono text-[11px] text-text-muted font-medium"
                >
                  DIRECTOR USERNAME
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. yash_director"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg border border-text-muted/30 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber outline-none font-body text-sm text-text-primary placeholder:text-text-muted/40 transition-colors"
                  />
                </div>
              </div>

              {/* Optional Email in Sign Up mode */}
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-email"
                    className="block font-mono text-[11px] text-text-muted font-medium"
                  >
                    EMAIL (OPTIONAL)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@studio.ai"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg border border-text-muted/30 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber outline-none font-body text-sm text-text-primary placeholder:text-text-muted/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block font-mono text-[11px] text-text-muted font-medium"
                  >
                    PASSWORD
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => alert("Password reset sent to demo inbox.")}
                      className="font-mono text-[11px] text-accent-amber hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-bg border border-text-muted/30 focus:border-accent-amber focus:ring-1 focus:ring-accent-amber outline-none font-body text-sm text-text-primary placeholder:text-text-muted/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-lg bg-accent-amber text-bg font-mono text-xs font-bold hover:bg-accent-amber/90 active:bg-accent-amber/80 transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent-amber/20 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>{mode === "signin" ? "SIGN IN AS DIRECTOR" : "CREATE DIRECTOR ACCOUNT"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-1">
              <div className="border-t border-text-muted/20 w-full" />
              <span className="bg-surface px-3 font-mono text-[10px] text-text-muted/60 uppercase">
                Or Instant Entry
              </span>
            </div>

            {/* 1-Click Guest Demo Login */}
            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg bg-surface-raised hover:bg-surface border border-accent-teal-bright/40 text-accent-teal-bright font-mono text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>CONTINUE AS @demo_director (1-CLICK)</span>
            </button>
          </div>
        </div>
      </main>

      {/* 4. Minimal Footer */}
      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg flex items-center justify-center font-mono text-xs text-accent-amber">Loading Director Gateway...</div>}>
      <LoginForm />
    </Suspense>
  );
}
