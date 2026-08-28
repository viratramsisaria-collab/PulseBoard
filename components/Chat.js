"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { connectSocket } from "@/lib/socket";

export default function Chat({
  workspaceId,
  user,
  initialMessages = [],
}) {
  const [messages, setMessages] =
    useState(initialMessages);

  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const typingTimeout = useRef(null);

  useEffect(() => {
    const socket = connectSocket();

    socket.emit("workspace:join", workspaceId);

    const handleMessage = (newMessage) => {
      setMessages((current) => [
        ...current,
        newMessage,
      ]);
    };

    const handleTyping = () => {
      setTyping(true);

      clearTimeout(typingTimeout.current);

      typingTimeout.current = setTimeout(() => {
        setTyping(false);
      }, 1500);
    };

    socket.on("chat:message", handleMessage);
    socket.on("chat:typing", handleTyping);

    return () => {
      socket.emit("workspace:leave", workspaceId);
      socket.off("chat:message", handleMessage);
      socket.off("chat:typing", handleTyping);
    };
  }, [workspaceId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspace: workspaceId,
        content: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) return;

    const socket = connectSocket();

    socket.emit("chat:message", {
      workspaceId,
      ...data.message,
    });

    setMessage("");
  };

  const handleTyping = () => {
    const socket = connectSocket();

    socket.emit("chat:typing", {
      workspaceId,
      userId: user?.id,
      name: user?.name,
    });
  };

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-2xl border bg-background">
      <div className="border-b px-4 py-3">
        <h3 className="font-semibold">
          Workspace Chat
        </h3>

        <AnimatePresence>
          {typing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              Someone is typing...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {messages.map((item, index) => {
            const mine =
              item.sender?._id === user?.id ||
              item.sender === user?.id;

            return (
              <motion.div
                key={item._id || index}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {!mine && (
                    <p className="mb-1 text-xs font-medium">
                      {item.sender?.name}
                    </p>
                  )}

                  {item.content}
                </div>
              </motion.div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="flex gap-2 border-t p-3">
        <Input
          value={message}
          placeholder="Type a message..."
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <Button
          size="icon"
          onClick={sendMessage}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}