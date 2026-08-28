"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Command,
  Layers3,
  MessageSquare,
  MoveRight,
  Radio,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

import { motion } from "framer-motion";
import gsap from "gsap";

import {
  dashboardReveal,
  heroReveal,
  magnetic,
  scrollReveal,
  tiltCard,
} from "@/lib/animations";

/* =========================================================
   LANDING PAGE
========================================================= */

export default function HomePage() {
  const pageRef = useRef(null);
  const heroRef = useRef(null);
  const dashboardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      heroReveal(heroRef.current);
      dashboardReveal(dashboardRef.current);

      scrollReveal("[data-scroll-reveal]");

      const buttons =
        document.querySelectorAll("[data-magnetic]");

      const cleanups = [];

      buttons.forEach((button) => {
        const cleanup = magnetic(button, 0.18);

        if (cleanup) {
          cleanups.push(cleanup);
        }
      });

      if (dashboardRef.current) {
        const cleanup = tiltCard(
          dashboardRef.current,
          4
        );

        if (cleanup) {
          cleanups.push(cleanup);
        }
      }

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#08090d] text-white"
    >
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        ref={heroRef}
        className="relative flex min-h-screen items-center overflow-hidden pt-24"
      >
        {/* ambient grid */}

        <div className="hero-grid grid-background absolute inset-0" />

        {/* ambient glow */}

        <div className="hero-orb left-1/2 top-1/4 -translate-x-1/2" />

        <div className="pointer-events-none absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-violet-500/10 blur-[100px]" />

        <div className="pointer-events-none absolute right-[5%] top-[40%] h-56 w-56 rounded-full bg-blue-500/10 blur-[120px]" />

        <div className="pulse-container relative z-10 flex flex-col items-center text-center">
          {/* announcement */}

          <div
            data-hero-subtitle
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-xs text-white/60 backdrop-blur-xl"
          >
            <span className="realtime-indicator">
              Real-time collaboration
            </span>

            <ChevronRight className="h-3 w-3" />
          </div>

          {/* title */}

          <h1
            data-hero-title
            className="max-w-5xl text-balance text-5xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-6xl md:text-7xl lg:text-[92px]"
          >
            Your team.
            <br />

            <span className="gradient-text">
              One pulse.
            </span>

            <br />

            <span className="text-white/90">
              Real-time.
            </span>
          </h1>

          <p
            data-hero-subtitle
            className="mt-8 max-w-2xl text-balance text-base leading-7 text-white/45 sm:text-lg"
          >
            PulseBoard brings tasks, conversations,
            presence, and activity together in one
            beautifully synchronized workspace.
          </p>

          {/* CTA */}

          <div
            data-hero-actions
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              href="/register"
              data-magnetic
              className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-white px-6 text-sm font-medium text-black transition-transform"
            >
              <span className="relative z-10 flex items-center gap-2">
                Start collaborating
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              href="/login"
              data-magnetic
              className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] px-6 text-sm font-medium text-white/80 backdrop-blur-xl transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              Sign in
            </Link>
          </div>

          {/* trust */}

          <div className="mt-8 flex items-center gap-2 text-xs text-white/30">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            No complicated setup
          </div>

          {/* dashboard */}

          <div
            ref={dashboardRef}
            className="dashboard-surface relative mt-20 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f15] text-left shadow-[0_40px_120px_rgba(0,0,0,0.55)]"
          >
            <LiveBoard />

            {/* reflection */}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* =====================================================
          REAL-TIME STATEMENT
      ===================================================== */}

      <section className="relative border-y border-white/[0.06] py-28">
        <div className="pulse-container">
          <div
            data-scroll-reveal
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.03] p-2">
              <Radio className="h-5 w-5 text-violet-400" />
            </div>

            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Everything changes.
              <br />

              <span className="text-white/35">
                Everyone sees it.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/40 sm:text-base">
              No refreshing. No waiting. No wondering
              whether your teammate finished the task.
              Every action flows through PulseBoard
              instantly.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="relative py-32">
        <div className="pulse-container">
          <div
            data-scroll-reveal
            className="mb-16 max-w-2xl"
          >
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.25em] text-violet-400">
              Built for momentum
            </p>

            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Your entire team,
              <br />
              in sync.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FeatureCard
              icon={Zap}
              title="Real-time everything"
              description="Tasks, activity, presence, and conversations synchronize instantly across every connected client."
              large
            />

            <FeatureCard
              icon={Layers3}
              title="Visual workflows"
              description="Move work through a clean, focused board built for speed."
            />

            <FeatureCard
              icon={Users}
              title="Live presence"
              description="Know who's online, who's working, and what's changing."
            />

            <FeatureCard
              icon={MessageSquare}
              title="Contextual chat"
              description="Talk with your team without leaving the workspace."
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLABORATION
      ===================================================== */}

      <section className="relative overflow-hidden border-y border-white/[0.06] py-32">
        <div className="absolute inset-0 grid-background opacity-30" />

        <div className="pulse-container relative">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div data-scroll-reveal>
              <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-violet-400">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Live collaboration
              </div>

              <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                See the work
                <br />
                <span className="text-white/35">
                  as it happens.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-white/40 sm:text-base">
                PulseBoard turns invisible team activity
                into a living stream. When someone moves
                a task, joins the workspace, or sends a
                message, everyone sees it immediately.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  "Instant task synchronization",
                  "Live online presence",
                  "Real-time workspace activity",
                  "Instant messaging",
                ].map((item) => (
                  <motion.div
                    key={item}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-sm text-white/60"
                  >
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/10">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>

                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <LiveActivity />
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="py-24">
        <div className="pulse-container">
          <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] md:grid-cols-4">
            <Stat value="∞" label="Live events" />
            <Stat value="0ms" label="Manual refresh" />
            <Stat value="24/7" label="Workspace sync" />
            <Stat value="1" label="Shared pulse" />
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section className="relative overflow-hidden py-32">
        <div className="hero-orb left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />

        <div
          data-scroll-reveal
          className="pulse-container relative text-center"
        >
          <Sparkles className="mx-auto mb-7 h-7 w-7 text-violet-400" />

          <h2 className="mx-auto max-w-4xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
            Stop checking.
            <br />
            <span className="text-white/35">
              Start knowing.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
            Give your team one place where work,
            communication, and momentum are always
            moving together.
          </p>

          <div className="mt-9">
            <Link
              href="/register"
              data-magnetic
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-white px-7 text-sm font-medium text-black"
            >
              Create your workspace

              <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-white/[0.06] py-8">
        <div className="pulse-container flex flex-col gap-5 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-black">
              <Zap className="h-3.5 w-3.5" />
            </div>

            <span className="font-medium text-white/70">
              PulseBoard
            </span>
          </div>

          <div className="flex items-center gap-5">
            <span>
              Built for teams that move fast.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  return (
    <motion.nav
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="pulse-container pt-4">
        <div className="glass flex h-14 items-center justify-between rounded-2xl border-white/[0.08] px-4">
          <Link
            href="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
              <Zap className="h-4 w-4" />
            </div>

            <span className="font-semibold tracking-tight">
              PulseBoard
            </span>
          </Link>

          <div className="hidden items-center gap-7 text-xs text-white/45 md:flex">
          </div>

          <Link
            href="/register"
            data-magnetic
            className="flex h-9 items-center rounded-lg bg-white px-4 text-xs font-medium text-black"
          >
            Get started
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

/* =========================================================
   LIVE BOARD
========================================================= */

function LiveBoard() {
  const columns = [
    {
      title: "Todo",
      tasks: [
        {
          title: "Design landing page",
          user: "L",
        },
        {
          title: "Create API routes",
          user: "A",
        },
      ],
    },

    {
      title: "In Progress",
      tasks: [
        {
          title: "Socket.IO integration",
          user: "M",
          active: true,
        },
        {
          title: "Presence system",
          user: "J",
        },
      ],
    },

    {
      title: "Done",
      tasks: [
        {
          title: "Authentication",
          user: "L",
        },
        {
          title: "MongoDB setup",
          user: "A",
        },
      ],
    },
  ];

  return (
    <div className="relative">
      {/* top bar */}

      <div className="flex h-14 items-center justify-between border-b border-white/[0.07] px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
            <Command className="h-3.5 w-3.5" />
          </div>

          <span className="text-sm font-medium">
            PulseBoard
          </span>

          <span className="text-white/20">/</span>

          <span className="text-sm text-white/40">
            Product Launch
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-xs text-emerald-400 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            4 online
          </div>

          <div className="flex -space-x-2">
            {["L", "A", "M", "J"].map(
              (letter, index) => (
                <motion.div
                  key={letter}
                  initial={{
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    delay: 1.2 + index * 0.08,
                    type: "spring",
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0d0f15] bg-white/10 text-[9px] font-medium"
                >
                  {letter}
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>

      {/* board */}

      <div className="grid gap-4 p-5 md:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div key={column.title}>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-white/60">
                  {column.title}
                </span>

                <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-white/30">
                  {column.tasks.length}
                </span>
              </div>

              <span className="text-white/20">•••</span>
            </div>

            <div className="space-y-2">
              {column.tasks.map((task, taskIndex) => (
                <motion.div
                  key={task.title}
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.95,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  transition={{
                    delay:
                      1 +
                      columnIndex * 0.12 +
                      taskIndex * 0.08,
                    duration: 0.5,
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.015,
                  }}
                  className="group rounded-xl border border-white/[0.07] bg-white/[0.025] p-3 transition-colors hover:border-violet-400/20"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium leading-5 text-white/75">
                      {task.title}
                    </p>

                    {task.active && (
                      <span className="relative mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400">
                        <span className="absolute inset-[-3px] animate-ping rounded-full bg-emerald-400/30" />
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[8px]">
                      {task.user}
                    </div>

                    <span className="text-[9px] text-white/20">
                      Just now
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* live event */}

      <motion.div
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 2,
        }}
        className="border-t border-white/[0.07] px-5 py-3"
      >
        <div className="flex items-center gap-2 text-[10px] text-white/35">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <span className="text-white/60">
            Maya
          </span>

          moved{" "}
          <span className="text-white/60">
            Socket.IO integration
          </span>{" "}
          to In Progress

          <span className="ml-auto hidden text-white/20 sm:block">
            just now
          </span>
        </div>
      </motion.div>
    </div>
  );
}

/* =========================================================
   FEATURE CARD
========================================================= */

function FeatureCard({
  icon: Icon,
  title,
  description,
  large = false,
}) {
  return (
    <motion.div
      data-scroll-reveal
      whileHover={{
        y: -5,
      }}
      className={`group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] p-7 transition-colors hover:border-white/[0.13] ${
        large ? "md:row-span-2" : ""
      }`}
    >
      <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-500/10 blur-[70px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
          <Icon className="h-4 w-4 text-violet-400" />
        </div>

        <h3 className="text-xl font-semibold">
          {title}
        </h3>

        <p className="mt-3 max-w-md text-sm leading-6 text-white/35">
          {description}
        </p>

        <div className="mt-8 flex items-center gap-2 text-xs text-white/30 transition-colors group-hover:text-white/60">
          Explore
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   LIVE ACTIVITY
========================================================= */

function LiveActivity() {
  const events = [
    {
      user: "Alex",
      action: "completed",
      task: "Authentication",
      time: "2s",
    },
    {
      user: "Maya",
      action: "moved",
      task: "Socket.IO integration",
      time: "8s",
    },
    {
      user: "Jordan",
      action: "joined",
      task: "Product Launch",
      time: "14s",
    },
    {
      user: "Lavit",
      action: "created",
      task: "Presence system",
      time: "22s",
    },
  ];

  return (
    <div
      data-scroll-reveal
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0f15] p-5 shadow-2xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-400" />

          <span className="text-sm font-medium">
            Live activity
          </span>
        </div>

        <span className="text-[10px] text-emerald-400">
          LIVE
        </span>
      </div>

      <div className="space-y-2">
        {events.map((event, index) => (
          <motion.div
            key={`${event.user}-${event.task}`}
            initial={{
              opacity: 0,
              x: 20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: index * 0.1,
            }}
            className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-3"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-[10px]">
              {event.user.slice(0, 1)}
            </div>

            <div className="min-w-0 flex-1 text-xs">
              <span className="font-medium text-white/70">
                {event.user}
              </span>{" "}
              <span className="text-white/30">
                {event.action}
              </span>{" "}
              <span className="text-white/60">
                {event.task}
              </span>
            </div>

            <span className="text-[9px] text-white/20">
              {event.time}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   STAT
========================================================= */

function Stat({ value, label }) {
  return (
    <motion.div
      whileHover={{
        backgroundColor: "rgba(255,255,255,0.04)",
      }}
      className="border-r border-white/[0.06] p-7 last:border-r-0"
    >
      <div className="text-3xl font-semibold tracking-tight">
        {value}
      </div>

      <div className="mt-1 text-xs text-white/30">
        {label}
      </div>
    </motion.div>
  );
}

