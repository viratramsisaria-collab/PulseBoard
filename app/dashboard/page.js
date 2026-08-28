
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  LogOut,
  MessageSquare,
  Plus,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] =
    useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [meResponse, workspaceResponse] =
        await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/workspaces"),
        ]);

      if (meResponse.status === 401) {
        window.location.href = "/login";
        return;
      }

      const meData = await meResponse.json();
      const workspaceData =
        await workspaceResponse.json();

      if (!meResponse.ok) {
        throw new Error(
          meData.error || "Unable to load account"
        );
      }

      if (!workspaceResponse.ok) {
        throw new Error(
          workspaceData.error ||
            "Unable to load workspaces"
        );
      }

      setUser(meData.user);
      setWorkspaces(workspaceData.workspaces || []);
    } catch (error) {
      console.error("DASHBOARD_LOAD_ERROR:", error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createWorkspace(e) {
    e.preventDefault();

    if (!workspaceName.trim()) return;

    try {
      setCreating(true);
      setError("");

      const response = await fetch(
        "/api/workspaces",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: workspaceName.trim(),
            description:
              workspaceDescription.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create workspace"
        );
      }

      setWorkspaces((current) => [
        data.workspace,
        ...current,
      ]);

      setWorkspaceName("");
      setWorkspaceDescription("");
      setShowCreate(false);
    } catch (error) {
      console.error(
        "WORKSPACE_CREATE_ERROR:",
        error
      );

      setError(
        error.message ||
          "Unable to create workspace."
      );
    } finally {
      setCreating(false);
    }
  }

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch {
      // Ignore logout request errors.
    }

    window.location.href = "/login";
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-3 text-sm text-white/40"
        >
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/10 border-t-white/70" />
          Loading PulseBoard...
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-white">
      {/* Background */}

      <div className="pointer-events-none fixed inset-0 grid-background opacity-20" />

      <div className="pointer-events-none fixed left-1/2 top-[-250px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/[0.07] blur-[150px]" />

      <div className="pointer-events-none fixed bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.05] blur-[140px]" />

      {/* Navigation */}

      <header className="relative z-20 border-b border-white/[0.07] bg-[#08090d]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 lg:px-8">
          {/* Brand */}

          <Link
            href="/dashboard"
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                rotate: 8,
                scale: 1.05,
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-[0_0_35px_rgba(255,255,255,0.08)]"
            >
              <Zap className="h-4 w-4" />
            </motion.div>

            <div>
              <p className="text-sm font-semibold tracking-tight">
                PulseBoard
              </p>

              <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                Command center
              </p>
            </div>
          </Link>

          {/* Right */}

          <div className="flex items-center gap-2">
            <button
              className="hidden h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/40 transition hover:bg-white/[0.06] hover:text-white sm:flex"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </button>

            <div className="mx-1 hidden h-5 w-px bg-white/[0.07] sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.05] text-xs font-semibold">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div className="hidden md:block">
                <p className="text-xs font-medium">
                  {user?.name}
                </p>

                <p className="max-w-[180px] truncate text-[10px] text-white/25">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-red-500/10 hover:text-red-300"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}

      <section className="relative z-10 mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.05] px-2.5 py-1 text-[10px] font-medium text-emerald-300/70">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Systems operational
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Good to see you,{" "}
              <span className="text-white/40">
                {user?.name?.split(" ")[0]}.
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/30">
              Your real-time workspace command center.
              Create a workspace or jump back into
              one of your active projects.
            </p>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="group flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
            New workspace
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Error */}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                y: 0,
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                <span>{error}</span>

                <button
                  onClick={() => setError("")}
                  className="text-red-300/50 hover:text-red-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats */}

        <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Workspaces",
              value: workspaces.length,
              icon: Zap,
            },
            {
              label: "Active members",
              value: workspaces.reduce(
                (total, workspace) =>
                  total +
                  (workspace.members?.length || 0),
                0
              ),
              icon: Users,
            },
            {
              label: "Projects",
              value: workspaces.length,
              icon: Activity,
            },
            {
              label: "Live status",
              value: "ON",
              icon: Sparkles,
            },
          ].map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.07,
                }}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-white/30">
                    {stat.label}
                  </span>

                  <Icon className="h-4 w-4 text-white/15 transition group-hover:text-white/35" />
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <span className="text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </span>

                  <span className="mb-1 text-[9px] uppercase tracking-wider text-emerald-400/50">
                    Live
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Workspace Section */}

        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400">
                Your spaces
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Workspaces
              </h2>
            </div>

            <span className="text-xs text-white/20">
              {workspaces.length} total
            </span>
          </div>

          {workspaces.length === 0 ? (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="relative overflow-hidden rounded-2xl border border-dashed border-white/[0.1] bg-white/[0.015] p-10 text-center"
            >
              <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-violet-500/[0.06] blur-[80px]" />

              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.035]">
                  <Zap className="h-5 w-5 text-white/25" />
                </div>

                <h3 className="mt-5 text-sm font-semibold">
                  Your command center is empty
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-white/25">
                  Create your first workspace to
                  start managing tasks, collaborating
                  with your team, and communicating in
                  real time.
                </p>

                <button
                  onClick={() => setShowCreate(true)}
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-medium text-black transition hover:bg-white/90"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create workspace
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {workspaces.map(
                (workspace, index) => (
                  <motion.div
                    key={workspace._id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.08,
                    }}
                  >
                    <Link
                      href={`/workspace/${workspace._id}`}
                      className="group relative block overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/20 hover:bg-white/[0.04] hover:shadow-[0_20px_70px_rgba(0,0,0,0.25)]"
                    >
                      <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-violet-500/[0.05] blur-[50px] transition group-hover:bg-violet-500/[0.1]" />

                      <div className="relative">
                        <div className="flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.04] text-sm font-semibold text-white/70">
                            {workspace.name
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/10 bg-emerald-400/[0.04] px-2 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            <span className="text-[9px] text-emerald-300/60">
                              Active
                            </span>
                          </div>
                        </div>

                        <div className="mt-5">
                          <h3 className="truncate text-sm font-semibold transition group-hover:text-violet-200">
                            {workspace.name}
                          </h3>

                          <p className="mt-1.5 min-h-[40px] text-xs leading-5 text-white/25">
                            {workspace.description ||
                              "No workspace description."}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                              <Users className="h-3 w-3" />
                              {workspace.members
                                ?.length || 0}
                            </span>

                            <span className="flex items-center gap-1.5 text-[10px] text-white/25">
                              <Clock3 className="h-3 w-3" />
                              Live
                            </span>
                          </div>

                          <ChevronRight className="h-4 w-4 text-white/15 transition-transform group-hover:translate-x-1 group-hover:text-white/50" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              )}
            </div>
          )}
        </div>

        {/* Bottom overview */}

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: Activity,
              title: "Real-time activity",
              description:
                "See workspace changes as they happen.",
            },
            {
              icon: MessageSquare,
              title: "Team communication",
              description:
                "Chat with everyone inside your workspace.",
            },
            {
              icon: CheckCircle2,
              title: "Task management",
              description:
                "Track work from todo to completed.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                  delay: 0.25 + index * 0.08,
                }}
                className="flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.018] p-5"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
                  <Icon className="h-4 w-4 text-white/25" />
                </div>

                <div>
                  <h3 className="text-xs font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[10px] leading-5 text-white/20">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Create Workspace Modal */}

      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) {
                setShowCreate(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.97,
              }}
              transition={{
                duration: 0.3,
              }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d0e13] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-violet-400">
                    New workspace
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                    Create a workspace
                  </h2>
                </div>

                <button
                  onClick={() => setShowCreate(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/25 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={createWorkspace}
                className="space-y-5 p-6"
              >
                <div className="space-y-2">
                  <label
                    htmlFor="workspace-name"
                    className="text-xs font-medium text-white/60"
                  >
                    Workspace name
                  </label>

                  <input
                    id="workspace-name"
                    value={workspaceName}
                    onChange={(e) =>
                      setWorkspaceName(
                        e.target.value
                      )
                    }
                    autoFocus
                    required
                    maxLength={80}
                    placeholder="e.g. Product Team"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3.5 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="workspace-description"
                    className="text-xs font-medium text-white/60"
                  >
                    Description
                    <span className="ml-2 text-white/20">
                      optional
                    </span>
                  </label>

                  <textarea
                    id="workspace-description"
                    value={workspaceDescription}
                    onChange={(e) =>
                      setWorkspaceDescription(
                        e.target.value
                      )
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="What is this workspace for?"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3.5 py-3 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-violet-400/40 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setShowCreate(false)
                    }
                    className="h-11 flex-1 rounded-xl border border-white/[0.08] bg-white/[0.025] text-sm font-medium text-white/50 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      creating ||
                      !workspaceName.trim()
                    }
                    className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {creating ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : (
                      <>
                        Create
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
