"use client";

import { motion } from "framer-motion";
import {
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Workspaces",
    icon: FolderKanban,
  },
  {
    label: "Team",
    icon: Users,
  },
  {
    label: "Settings",
    icon: Settings,
  },
];

export default function Sidebar({ active = "Dashboard" }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background lg:block">
      <div className="sticky top-16 p-4">
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const selected = item.label === active;

            return (
              <motion.button
                key={item.label}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  selected
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {selected && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 h-6 w-0.5 rounded-full bg-primary"
                  />
                )}

                <Icon className="h-4 w-4" />

                {item.label}
              </motion.button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}