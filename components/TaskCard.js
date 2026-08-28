"use client";

import { motion } from "framer-motion";
import { GripVertical, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const priorityVariant = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
};

export default function TaskCard({
  task,
  onMove,
  onDelete,
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{
        opacity: 0,
        scale: 0.95,
      }}
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <Card className="group rounded-xl p-3 shadow-sm">
        <div className="flex items-start gap-2">
          <GripVertical className="mt-1 h-4 w-4 shrink-0 cursor-grab text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-medium">
                {task.title}
              </h4>

              <button
                onClick={() => onDelete?.(task)}
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {task.description && (
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <Badge
                variant={
                  priorityVariant[task.priority] || "outline"
                }
                className="text-[10px]"
              >
                {task.priority}
              </Badge>

              {task.assignee && (
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-[10px]">
                    {task.assignee.name
                      ?.slice(0, 1)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}