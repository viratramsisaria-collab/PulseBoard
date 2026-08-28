
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error || "Invalid email or password"
        );

        return;
      }

      // Login successful.
      // The API has already created the HTTP-only JWT cookie.
      router.replace("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("LOGIN_CLIENT_ERROR:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 py-12 text-white">
      {/* Background */}

      <div className="pointer-events-none absolute inset-0 grid-background opacity-40" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.08] blur-[140px]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#08090d_75%)]"
      />

      {/* Content */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Brand */}

        <Link
          href="/"
          className="mx-auto mb-10 flex w-fit items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <Zap className="h-4 w-4" />
          </div>

          <span className="text-lg font-semibold tracking-tight">
            PulseBoard
          </span>
        </Link>

        {/* Card */}

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 shadow-2xl backdrop-blur-2xl sm:p-8">
          <div className="mb-8">
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
              Welcome back
            </p>

            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to PulseBoard
            </h1>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Continue where your team left off.
            </p>
          </div>

          {/* Error */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mb-5 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300"
            >
              {error}
            </motion.div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-medium text-white/60"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3.5 text-sm text-white outline-none placeholder:text-white/20 transition-all focus:border-violet-400/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
              />
            </div>

            {/* Password */}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-xs font-medium text-white/60"
                >
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-violet-400 transition-colors hover:text-violet-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3.5 pr-11 text-sm text-white outline-none placeholder:text-white/20 transition-all focus:border-violet-400/40 focus:bg-white/[0.04] focus:ring-2 focus:ring-violet-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) => !value
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition-colors hover:text-white/60"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
              ) : (
                <>
                  Sign in

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/[0.07]" />

            <span className="text-[10px] uppercase tracking-wider text-white/20">
              New here?
            </span>

            <div className="h-px flex-1 bg-white/[0.07]" />
          </div>

          <Link
            href="/register"
            className="flex h-11 w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-white/70 transition-all hover:bg-white/[0.06] hover:text-white"
          >
            Create an account
          </Link>
        </div>

        <p className="mt-7 text-center text-[11px] text-white/20">
          By continuing, you agree to the PulseBoard
          terms and privacy policy.
        </p>
      </motion.div>
    </main>
  );
}
