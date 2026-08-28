"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";

const columns = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "doing",
    title: "Doing",
  },
  {
    id: "done",
    title: "Done",
  },
];

export default function Board({
  tasks = [],
  onCreateTask,
  onMoveTask,
  onDeleteTask,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.id
        );

        return (
          <motion.section
            key={column.id}
            layout
            className="min-h-[400px] rounded-2xl bg-muted/40 p-3"
          >
            <div className="mb-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">
                  {column.title}
                </h3>

                <span className="rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>

              {column.id === "todo" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onCreateTask}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onMove={onMoveTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}