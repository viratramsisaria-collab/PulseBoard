"use client";

import { motion } from "framer-motion";
import { MoreHorizontal, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function WorkspaceHeader({ workspace }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {workspace?.name}
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {workspace?.description || "Collaborative workspace"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Users className="mr-2 h-4 w-4" />
          Members
        </Button>

        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}