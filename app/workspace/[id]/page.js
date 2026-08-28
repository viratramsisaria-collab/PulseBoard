"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Circle,
  Clock3,
  Copy,
  Link2,
  Loader2,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Trash2,
  User,
  Users,
  X,
  Zap,
} from "lucide-react";

const columns = [
  {
    id: "todo",
    title: "To Do",
    icon: Circle,
  },
  {
    id: "doing",
    title: "In Progress",
    icon: Clock3,
  },
  {
    id: "done",
    title: "Done",
    icon: Check,
  },
];

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();

  const workspaceId = params.id;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [workspace, setWorkspace] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [creatingTask, setCreatingTask] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const [activeColumn, setActiveColumn] = useState("todo");

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  const [message, setMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [generatingInvite, setGeneratingInvite] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteError, setInviteError] = useState("");

  /*
   * ---------------------------------------------------------
   * LOAD WORKSPACE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!workspaceId) return;

    loadWorkspace();
  }, [workspaceId]);

  /*
   * ---------------------------------------------------------
   * SOCKET.IO CONNECTION
   * ---------------------------------------------------------
   *
   * This is the important part that was missing.
   *
   * Every workspace page:
   * 1. Connects to Socket.IO
   * 2. Joins its workspace room
   * 3. Listens for task changes
   * 4. Listens for chat messages
   * 5. Leaves the room on unmount
   */

  useEffect(() => {
    if (!workspaceId) return;

    const socketUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      window.location.origin;

    const socket = io(socketUrl, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("workspace:join", workspaceId);
    });

    socket.on("connect_error", (error) => {
      console.error("SOCKET_CONNECTION_ERROR:", error);
    });

    /*
     * -------------------------------------------------------
     * TASK MOVED
     * -------------------------------------------------------
     */

    socket.on("task:moved", (data) => {
      if (!data?.task) return;

      if (data.workspaceId !== workspaceId) return;

      setTasks((current) => {
        const exists = current.some(
          (task) => task._id === data.task._id
        );

        if (!exists) {
          return [...current, data.task];
        }

        return current.map((task) =>
          task._id === data.task._id
            ? data.task
            : task
        );
      });
    });

    /*
     * -------------------------------------------------------
     * TASK CREATED
     * -------------------------------------------------------
     */

    socket.on("task:created", (data) => {
      if (!data?.task) return;

      if (data.workspaceId !== workspaceId) return;

      setTasks((current) => {
        const exists = current.some(
          (task) => task._id === data.task._id
        );

        if (exists) {
          return current;
        }

        return [...current, data.task];
      });
    });

    /*
     * -------------------------------------------------------
     * TASK UPDATED
     * -------------------------------------------------------
     */

    socket.on("task:updated", (data) => {
      if (!data?.task) return;

      if (data.workspaceId !== workspaceId) return;

      setTasks((current) =>
        current.map((task) =>
          task._id === data.task._id
            ? data.task
            : task
        )
      );
    });

    /*
     * -------------------------------------------------------
     * TASK DELETED
     * -------------------------------------------------------
     */

    socket.on("task:deleted", (data) => {
      if (!data?.taskId) return;

      if (data.workspaceId !== workspaceId) return;

      setTasks((current) =>
        current.filter(
          (task) => task._id !== data.taskId
        )
      );
    });

    /*
     * -------------------------------------------------------
     * CHAT MESSAGE
     * -------------------------------------------------------
     */

    socket.on("chat:message", (data) => {
      if (!data?.message) return;

      if (data.workspaceId !== workspaceId) return;

      setMessages((current) => {
        const exists = current.some(
          (message) =>
            message._id === data.message._id
        );

        if (exists) {
          return current;
        }

        return [...current, data.message];
      });
    });

    /*
     * -------------------------------------------------------
     * USER JOINED
     * -------------------------------------------------------
     */

    socket.on("user:joined", (data) => {
      console.log("User joined workspace:", data);
    });

    /*
     * -------------------------------------------------------
     * USER LEFT
     * -------------------------------------------------------
     */

    socket.on("user:left", (data) => {
      console.log("User left workspace:", data);
    });

    /*
     * -------------------------------------------------------
     * CLEANUP
     * -------------------------------------------------------
     */

    return () => {
      socket.emit("workspace:leave", workspaceId);

      socket.removeAllListeners();

      socket.disconnect();

      socketRef.current = null;
    };
  }, [workspaceId]);

  /*
   * ---------------------------------------------------------
   * AUTO SCROLL CHAT
   * ---------------------------------------------------------
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * ---------------------------------------------------------
   * LOAD DATA
   * ---------------------------------------------------------
   */

  async function loadWorkspace() {
    try {
      setLoading(true);

      const [
        workspaceResponse,
        tasksResponse,
        messagesResponse,
        meResponse,
      ] = await Promise.all([
        fetch("/api/workspaces"),
        fetch(`/api/tasks?workspace=${workspaceId}`),
        fetch(`/api/messages?workspace=${workspaceId}`),
        fetch("/api/auth/me"),
      ]);

      if (
        workspaceResponse.status === 401 ||
        meResponse.status === 401
      ) {
        router.push("/login");
        return;
      }

      const workspaceData =
        await workspaceResponse.json();

      const tasksData =
        await tasksResponse.json();

      const messagesData =
        await messagesResponse.json();

      const meData = await meResponse.json();

      const foundWorkspace =
        workspaceData.workspaces?.find(
          (item) => item._id === workspaceId
        );

      if (!foundWorkspace) {
        router.push("/dashboard");
        return;
      }

      setWorkspace(foundWorkspace);
      setTasks(tasksData.tasks || []);
      setMessages(messagesData.messages || []);
      setCurrentUser(meData.user || null);
    } catch (error) {
      console.error(
        "WORKSPACE_LOAD_ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * INVITE
   * ---------------------------------------------------------
   */

  async function generateInviteLink() {
    try {
      setGeneratingInvite(true);
      setInviteError("");
      setCopied(false);

      const response = await fetch(
        `/api/workspaces/${workspaceId}/invite`,
        {
          method: "POST",
        }
      );

      const contentType =
        response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Invite API is not available. Make sure the invite route exists."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate invite link"
        );
      }

      setInviteUrl(data.inviteUrl);
      setShowInvite(true);
    } catch (error) {
      console.error(
        "GENERATE_INVITE_ERROR:",
        error
      );

      setInviteError(error.message);
    } finally {
      setGeneratingInvite(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteUrl) return;

    try {
      await navigator.clipboard.writeText(
        inviteUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "COPY_INVITE_ERROR:",
        error
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * CREATE TASK
   * ---------------------------------------------------------
   */

  async function createTask(e) {
    e.preventDefault();

    if (!taskForm.title.trim()) return;

    try {
      setCreatingTask(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace: workspaceId,
          title: taskForm.title,
          description: taskForm.description,
          status: activeColumn,
          priority: taskForm.priority,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to create task"
        );
      }

      /*
       * Update our own UI immediately.
       */

      setTasks((current) => {
        const exists = current.some(
          (task) => task._id === data.task._id
        );

        if (exists) return current;

        return [...current, data.task];
      });

      /*
       * Tell everyone else in the workspace.
       */

      socketRef.current?.emit("task:created", {
        workspaceId,
        task: data.task,
      });

      setTaskForm({
        title: "",
        description: "",
        priority: "medium",
      });

      setShowTaskModal(false);
    } catch (error) {
      console.error(
        "CREATE_TASK_ERROR:",
        error
      );
    } finally {
      setCreatingTask(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * UPDATE TASK
   * ---------------------------------------------------------
   */

  async function updateTask(task, updates) {
    try {
      const response = await fetch("/api/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: task._id,
          workspace: workspaceId,
          ...updates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update task"
        );
      }

      /*
       * Update local UI immediately.
       */

      setTasks((current) =>
        current.map((item) =>
          item._id === task._id
            ? data.task
            : item
        )
      );

      /*
       * Broadcast the change.
       */

      const eventName =
        updates.status !== undefined
          ? "task:moved"
          : "task:updated";

      socketRef.current?.emit(eventName, {
        workspaceId,
        task: data.task,
      });
    } catch (error) {
      console.error(
        "UPDATE_TASK_ERROR:",
        error
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * DELETE TASK
   * ---------------------------------------------------------
   */

  async function deleteTask(task) {
    try {
      const response = await fetch(
        `/api/tasks?id=${task._id}&workspace=${workspaceId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.error ||
            "Failed to delete task"
        );
      }

      /*
       * Remove locally.
       */

      setTasks((current) =>
        current.filter(
          (item) => item._id !== task._id
        )
      );

      /*
       * Tell other workspace members.
       */

      socketRef.current?.emit("task:deleted", {
        workspaceId,
        taskId: task._id,
      });
    } catch (error) {
      console.error(
        "DELETE_TASK_ERROR:",
        error
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * SEND MESSAGE
   * ---------------------------------------------------------
   */

  async function sendMessage(e) {
    e.preventDefault();

    if (
      !message.trim() ||
      sendingMessage
    ) {
      return;
    }

    try {
      setSendingMessage(true);

      const response = await fetch(
        "/api/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workspace: workspaceId,
            content: message.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to send message"
        );
      }

      /*
       * Add message immediately for sender.
       */

      setMessages((current) => {
        const exists = current.some(
          (item) =>
            item._id === data.message._id
        );

        if (exists) return current;

        return [...current, data.message];
      });

      /*
       * Broadcast to everyone else.
       *
       * Your server currently uses io.to(...)
       * for chat, so the sender will also receive
       * this event. The duplicate check above prevents
       * the message from appearing twice.
       */

      socketRef.current?.emit(
        "chat:message",
        {
          workspaceId,
          message: data.message,
        }
      );

      setMessage("");
    } catch (error) {
      console.error(
        "SEND_MESSAGE_ERROR:",
        error
      );
    } finally {
      setSendingMessage(false);
    }
  }

  /*
   * ---------------------------------------------------------
   * GROUP TASKS
   * ---------------------------------------------------------
   */

  const groupedTasks = useMemo(() => {
    return {
      todo: tasks.filter(
        (task) => task.status === "todo"
      ),

      doing: tasks.filter(
        (task) => task.status === "doing"
      ),

      done: tasks.filter(
        (task) => task.status === "done"
      ),
    };
  }, [tasks]);

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
        <div className="flex items-center gap-3 text-white/40">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading workspace...
        </div>
      </main>
    );
  }

  if (!workspace) {
    return null;
  }

  /*
   * ---------------------------------------------------------
   * PAGE
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-white">
      <div className="pointer-events-none fixed inset-0 grid-background opacity-20" />

      <div className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-500/[0.04] blur-[140px]" />

      {/* HEADER */}

      <header className="relative z-20 flex h-16 items-center justify-between border-b border-white/[0.07] bg-[#08090d]/80 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.025] text-white/45 transition hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="h-6 w-px bg-white/[0.08]" />

          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-violet-400" />

              <h1 className="text-sm font-semibold">
                {workspace.name}
              </h1>
            </div>

            {workspace.description && (
              <p className="mt-0.5 max-w-[400px] truncate text-[11px] text-white/25">
                {workspace.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* INVITE */}

          <button
            onClick={() => {
              setShowInvite(true);

              if (!inviteUrl) {
                generateInviteLink();
              }
            }}
            className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-medium text-black transition hover:bg-white/90"
          >
            <Link2 className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Invite
            </span>
          </button>

          {/* MEMBER AVATARS */}

          <div className="hidden items-center -space-x-2 sm:flex">
            {workspace.members
              ?.slice(0, 5)
              .map((member) => (
                <div
                  key={member.user?._id}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#08090d] bg-white/[0.08] text-[10px] font-medium"
                  title={member.user?.name}
                >
                  {member.user?.avatar ? (
                    <img
                      src={member.user.avatar}
                      alt={member.user.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    member.user?.name
                      ?.charAt(0)
                      ?.toUpperCase()
                  )}
                </div>
              ))}

            {workspace.members?.length > 5 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#08090d] bg-white/[0.06] text-[9px] text-white/50">
                +{workspace.members.length - 5}
              </div>
            )}
          </div>

          <button
            onClick={() =>
              setShowMembers(
                (current) => !current
              )
            }
            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 text-xs text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <Users className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Members
            </span>
          </button>
        </div>
      </header>

      {/* WORKSPACE */}

      <div className="relative z-10 grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[1fr_340px]">
        {/* BOARD */}

        <section className="min-w-0 p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400">
                Workspace
              </p>

              <h2 className="mt-1 text-xl font-semibold tracking-tight">
                Task board
              </h2>
            </div>

            <button
              onClick={() => {
                setActiveColumn("todo");
                setShowTaskModal(true);
              }}
              className="flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-xs font-medium text-black transition hover:bg-white/90"
            >
              <Plus className="h-3.5 w-3.5" />
              New task
            </button>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {columns.map(
              (column, index) => {
                const ColumnIcon =
                  column.icon;

                const columnTasks =
                  groupedTasks[column.id];

                return (
                  <motion.div
                    key={column.id}
                    layout
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.08,
                      duration: 0.45,
                    }}
                    className="min-h-[500px] rounded-2xl border border-white/[0.07] bg-white/[0.018] p-3"
                  >
                    <div className="mb-3 flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <ColumnIcon
                          className={`h-3.5 w-3.5 ${
                            column.id ===
                            "done"
                              ? "text-emerald-400"
                              : column.id ===
                                "doing"
                              ? "text-amber-400"
                              : "text-white/30"
                          }`}
                        />

                        <span className="text-xs font-medium text-white/65">
                          {column.title}
                        </span>

                        <span className="rounded-md bg-white/[0.05] px-1.5 py-0.5 text-[9px] text-white/30">
                          {columnTasks.length}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setActiveColumn(
                            column.id
                          );

                          setShowTaskModal(
                            true
                          );
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-white/25 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <AnimatePresence>
                        {columnTasks.map(
                          (task) => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              onUpdate={
                                updateTask
                              }
                              onDelete={
                                deleteTask
                              }
                            />
                          )
                        )}
                      </AnimatePresence>

                      {columnTasks.length ===
                        0 && (
                        <div className="flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-white/[0.06]">
                          <div className="text-center">
                            <Sparkles className="mx-auto mb-2 h-4 w-4 text-white/15" />

                            <p className="text-[11px] text-white/20">
                              Nothing here
                              yet
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              }
            )}
          </div>
        </section>

        {/* CHAT */}

        <aside className="flex min-h-[550px] flex-col border-t border-white/[0.07] bg-black/10 xl:border-l xl:border-t-0">
          <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-violet-400" />

                <h3 className="text-sm font-semibold">
                  Team chat
                </h3>
              </div>

              <p className="mt-0.5 text-[10px] text-white/25">
                Real-time workspace
                discussion
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

              <span className="text-[10px] text-white/30">
                {workspace.members
                  ?.length || 0}{" "}
                members
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.length === 0 ? (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]">
                  <MessageSquare className="h-4 w-4 text-white/25" />
                </div>

                <p className="text-xs font-medium text-white/50">
                  No messages yet
                </p>

                <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-white/20">
                  Start the conversation
                  with your team.
                </p>
              </div>
            ) : (
              messages.map((item) => {
                const ownMessage =
                  item.sender?._id ===
                  currentUser?._id;

                return (
                  <motion.div
                    key={item._id}
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className={`flex gap-2.5 ${
                      ownMessage
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.07] text-[9px] font-medium text-white/50">
                      {item.sender?.avatar ? (
                        <img
                          src={
                            item.sender.avatar
                          }
                          alt={
                            item.sender.name
                          }
                          className="h-full w-full rounded-full object-cover"
                        />
                      ) : (
                        item.sender?.name
                          ?.charAt(0)
                          ?.toUpperCase()
                      )}
                    </div>

                    <div
                      className={`max-w-[80%] ${
                        ownMessage
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[10px] font-medium text-white/45">
                          {ownMessage
                            ? "You"
                            : item.sender
                                ?.name}
                        </span>

                        <span className="text-[9px] text-white/15">
                          {formatTime(
                            item.createdAt
                          )}
                        </span>
                      </div>

                      <div
                        className={`rounded-xl px-3 py-2 text-xs leading-5 ${
                          ownMessage
                            ? "bg-violet-500/15 text-white/75"
                            : "bg-white/[0.045] text-white/55"
                        }`}
                      >
                        {item.content}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={sendMessage}
            className="border-t border-white/[0.07] p-3"
          >
            <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] p-1.5">
              <input
                value={message}
                onChange={(e) =>
                  setMessage(
                    e.target.value
                  )
                }
                placeholder="Message your team..."
                className="h-9 min-w-0 flex-1 bg-transparent px-2 text-xs text-white outline-none placeholder:text-white/20"
              />

              <button
                type="submit"
                disabled={
                  !message.trim() ||
                  sendingMessage
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
              >
                {sendingMessage ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </form>
        </aside>
      </div>

      {/* MEMBERS */}

      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 20,
            }}
            className="fixed right-5 top-20 z-50 w-80 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101116] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Workspace members
                </h3>

                <p className="mt-1 text-[10px] text-white/25">
                  {workspace.members
                    ?.length || 0}{" "}
                  people
                </p>
              </div>

              <button
                onClick={() =>
                  setShowMembers(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 hover:bg-white/[0.05] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-3">
              {workspace.members?.map(
                (member) => (
                  <div
                    key={member.user?._id}
                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.04]"
                  >
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/[0.07] text-xs text-white/50">
                      {member.user?.avatar ? (
                        <img
                          src={
                            member.user
                              .avatar
                          }
                          alt={
                            member.user.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        member.user?.name
                          ?.charAt(0)
                          ?.toUpperCase()
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white/70">
                        {
                          member.user
                            ?.name
                        }
                      </p>

                      <p className="truncate text-[10px] text-white/25">
                        {
                          member.user
                            ?.email
                        }
                      </p>
                    </div>

                    <span className="rounded-md bg-white/[0.05] px-2 py-1 text-[9px] capitalize text-white/30">
                      {member.role}
                    </span>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INVITE MODAL */}

      <AnimatePresence>
        {showInvite && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                setShowInvite(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.98,
              }}
              className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#101116] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400">
                    Collaboration
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Invite your team
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-white/30">
                    Anyone with this link
                    can sign in and join
                    this workspace.
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowInvite(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {generatingInvite ? (
                <div className="flex h-20 items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-black/20 text-xs text-white/30">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating secure invite
                  link...
                </div>
              ) : inviteError ? (
                <div className="rounded-xl border border-red-400/10 bg-red-400/5 p-4">
                  <p className="text-xs text-red-300">
                    {inviteError}
                  </p>

                  <button
                    onClick={
                      generateInviteLink
                    }
                    className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-white/[0.08] bg-black/20 p-3">
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 shrink-0 text-violet-400" />

                      <input
                        readOnly
                        value={inviteUrl}
                        className="min-w-0 flex-1 bg-transparent text-xs text-white/60 outline-none"
                      />

                      <button
                        onClick={
                          copyInviteLink
                        }
                        className="flex h-8 shrink-0 items-center gap-2 rounded-lg bg-white px-3 text-[10px] font-medium text-black transition hover:bg-white/90"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={
                      generateInviteLink
                    }
                    className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] text-xs text-white/40 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Generate new link
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CREATE TASK MODAL */}

      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
            onMouseDown={(e) => {
              if (
                e.target ===
                e.currentTarget
              ) {
                setShowTaskModal(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.98,
              }}
              className="w-full max-w-md rounded-2xl border border-white/[0.09] bg-[#101116] p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-violet-400">
                    New task
                  </p>

                  <h3 className="mt-1 text-lg font-semibold">
                    Add to{" "}
                    {
                      columns.find(
                        (column) =>
                          column.id ===
                          activeColumn
                      )?.title
                    }
                  </h3>
                </div>

                <button
                  onClick={() =>
                    setShowTaskModal(false)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={createTask}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-[11px] font-medium text-white/50">
                    Task title
                  </label>

                  <input
                    autoFocus
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        title:
                          e.target.value,
                      })
                    }
                    placeholder="What needs to be done?"
                    className="h-11 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-white/50">
                    Description
                  </label>

                  <textarea
                    value={
                      taskForm.description
                    }
                    onChange={(e) =>
                      setTaskForm({
                        ...taskForm,
                        description:
                          e.target.value,
                      })
                    }
                    placeholder="Add some context..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-violet-400/40"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-medium text-white/50">
                    Priority
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "low",
                      "medium",
                      "high",
                    ].map(
                      (priority) => (
                        <button
                          key={priority}
                          type="button"
                          onClick={() =>
                            setTaskForm({
                              ...taskForm,
                              priority,
                            })
                          }
                          className={`h-9 rounded-lg border text-[11px] capitalize transition ${
                            taskForm.priority ===
                            priority
                              ? "border-violet-400/30 bg-violet-500/10 text-violet-300"
                              : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60"
                          }`}
                        >
                          {priority}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    creatingTask ||
                    !taskForm.title.trim()
                  }
                  className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {creatingTask ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create task
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/*
 * -----------------------------------------------------------
 * TASK CARD
 * -----------------------------------------------------------
 */

function TaskCard({
  task,
  onUpdate,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const priorityClasses = {
    low: "bg-white/[0.04] text-white/30",

    medium:
      "bg-amber-400/10 text-amber-300",

    high:
      "bg-red-400/10 text-red-300",
  };

  function nextStatus() {
    if (task.status === "todo") {
      return "doing";
    }

    if (task.status === "doing") {
      return "done";
    }

    return "todo";
  }

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.96,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.96,
      }}
      className="group relative rounded-xl border border-white/[0.07] bg-[#101116] p-3 transition hover:border-white/[0.12] hover:bg-white/[0.035]"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h4 className="text-xs font-medium leading-5 text-white/75">
          {task.title}
        </h4>

        <div className="relative">
          <button
            onClick={() =>
              setMenuOpen(
                (current) => !current
              )
            }
            className="flex h-6 w-6 items-center justify-center rounded-md text-white/15 opacity-0 transition hover:bg-white/[0.06] hover:text-white group-hover:opacity-100"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                  scale: 0.96,
                }}
                className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-lg border border-white/[0.08] bg-[#17181e] p-1 shadow-2xl"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);

                    onUpdate(task, {
                      status:
                        nextStatus(),
                    });
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-white/50 hover:bg-white/[0.06] hover:text-white"
                >
                  <ChevronDown className="h-3 w-3" />

                  Move task
                </button>

                <button
                  onClick={() => {
                    setMenuOpen(false);

                    onDelete(task);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-[10px] text-red-300/60 hover:bg-red-400/10 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />

                  Delete task
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 text-[10px] leading-4 text-white/25">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span
          className={`rounded-md px-1.5 py-1 text-[9px] font-medium capitalize ${
            priorityClasses[
              task.priority
            ] ||
            priorityClasses.medium
          }`}
        >
          {task.priority}
        </span>

        <div className="flex items-center gap-2">
          {task.assignee ? (
            <div
              title={
                task.assignee.name
              }
              className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07] text-[8px] text-white/40"
            >
              {task.assignee.avatar ? (
                <img
                  src={
                    task.assignee.avatar
                  }
                  alt={
                    task.assignee.name
                  }
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                task.assignee.name
                  ?.charAt(0)
                  ?.toUpperCase()
              )}
            </div>
          ) : (
            <User className="h-3 w-3 text-white/15" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/*
 * -----------------------------------------------------------
 * TIME FORMATTER
 * -----------------------------------------------------------
 */

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}