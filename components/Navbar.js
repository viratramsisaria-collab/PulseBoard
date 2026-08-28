"use client";

import { motion } from "framer-motion";
import { Bell, Search, Zap } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export default function Navbar({ user }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-xl text-black"
    >
      <div className="flex items-center gap-3">
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-black"
        >
          <Zap className="h-5 w-5" />
        </motion.div>

        <span className="text-lg font-semibold tracking-tight">
          PulseBoard
        </span>
      </div>

      <div className="hidden w-full max-w-md md:block">
        <div className="flex items-center gap-2 rounded-xl border bg-muted/40 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />

          <input
            placeholder="Search workspace..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />

          <kbd className="hidden rounded border px-1.5 py-0.5 text-xs text-muted-foreground lg:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Bell className="h-4 w-4" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {user?.name?.slice(0, 1)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </motion.header>
  );
}