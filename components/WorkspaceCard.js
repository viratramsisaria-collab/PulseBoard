"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WorkspaceCard({ workspace, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.2,
        },
      }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={onClick}
        className="group cursor-pointer overflow-hidden rounded-2xl border p-5 transition-shadow hover:shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {workspace?.name?.slice(0, 1)?.toUpperCase()}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>

        <h3 className="font-semibold">
          {workspace.name}
        </h3>

        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {workspace.description || "No description"}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            {workspace.members?.length || 0}
          </Badge>

          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </div>
      </Card>
    </motion.div>
  );
}