"use client";

import { motion } from "framer-motion";

export default function Presence({ count = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs"
    >
      <motion.span
        animate={{
          opacity: [1, 0.4, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
        className="h-2 w-2 rounded-full bg-green-500"
      />

      <span>
        {count} {count === 1 ? "person" : "people"} online
      </span>
    </motion.div>
  );
}