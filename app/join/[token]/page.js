"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Users,
  Zap,
} from "lucide-react";

export default function JoinWorkspacePage() {
  const { token } = useParams();
  const router = useRouter();

  const [workspace, setWorkspace] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInvite() {
      try {
        const response = await fetch(
          `/api/workspaces/join/${token}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Invalid invite link"
          );
        }

        setWorkspace(data.workspace);
        setAuthenticated(data.authenticated);
        setAlreadyMember(data.alreadyMember);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadInvite();
    }
  }, [token]);

  async function handleJoin() {
    if (!authenticated) {
      router.push(
        `/login?returnTo=/join/${encodeURIComponent(token)}`
      );
      return;
    }

    setJoining(true);
    setError("");

    try {
      const response = await fetch(
        `/api/workspaces/join/${token}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to join workspace"
        );
      }

      router.push(`/workspace/${data.workspaceId}`);
    } catch (error) {
      setError(error.message);
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-4 text-white">
        <div className="w-full max-w-md rounded-2xl border border-red-400/10 bg-white/[0.035] p-8 text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <Zap className="h-5 w-5" />
          </div>

          <h1 className="text-xl font-semibold">
            Invalid invitation
          </h1>

          <p className="mt-2 text-sm text-white/40">
            {error}
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-6 h-10 rounded-xl bg-white px-5 text-sm font-medium text-black"
          >
            Go home
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08090d] px-4 text-white">
      <div className="pointer-events-none absolute inset-0 grid-background opacity-30" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black">
            <Zap className="h-4 w-4" />
          </div>

          <span className="text-lg font-semibold">
            PulseBoard
          </span>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <Users className="h-7 w-7" />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.2em] text-violet-400">
            Workspace invitation
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Join {workspace.name}
          </h1>

          {workspace.description && (
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
              {workspace.description}
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/40">
            <Users className="h-4 w-4" />
            {workspace.memberCount}{" "}
            {workspace.memberCount === 1
              ? "member"
              : "members"}
          </div>

          {alreadyMember ? (
            <button
              onClick={() =>
                router.push(
                  `/workspace/${workspace.id}`
                )
              }
              className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black"
            >
              <Check className="h-4 w-4" />
              Open workspace
            </button>
          ) : (
            <button
              onClick={handleJoin}
              disabled={joining}
              className="group mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:opacity-60"
            >
              {joining ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {authenticated
                    ? "Join workspace"
                    : "Sign in to join"}

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
}