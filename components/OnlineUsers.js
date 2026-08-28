"use client";

import { motion } from "framer-motion";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export default function OnlineUsers({ users = [] }) {
  return (
    <div className="flex items-center">
      {users.slice(0, 6).map((user, index) => (
        <motion.div
          key={user._id || user.id}
          initial={{
            opacity: 0,
            scale: 0,
            x: -10,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          transition={{
            delay: index * 0.05,
          }}
          className="-ml-2 first:ml-0"
        >
          <Avatar className="h-8 w-8 border-2 border-background">
            <AvatarFallback>
              {user.name
                ?.slice(0, 1)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      ))}

      {users.length > 6 && (
        <span className="ml-2 text-xs text-muted-foreground">
          +{users.length - 6}
        </span>
      )}
    </div>
  );
}