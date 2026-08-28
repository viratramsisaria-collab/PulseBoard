"use client";

import { motion } from "framer-motion";
import { Activity } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function ActivityFeed({
  activities = [],
}) {
  return (
    <div className="rounded-2xl border bg-background">
      <div className="flex items-center gap-2 border-b p-4">
        <Activity className="h-4 w-4" />

        <h3 className="font-semibold">
          Live Activity
        </h3>
      </div>

      <ScrollArea className="h-[350px]">
        <div className="p-4">
          {activities.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No activity yet
            </p>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity._id || index}
                  initial={{
                    opacity: 0,
                    x: -15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  className="flex gap-3"
                >
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />

                  <div>
                    <p className="text-sm">
                      <span className="font-medium">
                        {activity.user?.name ||
                          "Someone"}
                      </span>{" "}
                      {activity.action.replaceAll(
                        "_",
                        " "
                      )}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(
                        activity.createdAt
                      ).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}