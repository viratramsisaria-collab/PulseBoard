const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({
  dev,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("workspace:join", (workspaceId) => {
      if (!workspaceId) return;

      socket.join(`workspace:${workspaceId}`);

      socket.to(`workspace:${workspaceId}`).emit("user:joined", {
        socketId: socket.id,
      });
    });

    socket.on("workspace:leave", (workspaceId) => {
      if (!workspaceId) return;

      socket.leave(`workspace:${workspaceId}`);

      socket
        .to(`workspace:${workspaceId}`)
        .emit("user:left", {
          socketId: socket.id,
        });
    });

    socket.on("task:moved", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("task:moved", data);
    });

    socket.on("task:created", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("task:created", data);
    });

    socket.on("task:updated", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("task:updated", data);
    });

    socket.on("task:deleted", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("task:deleted", data);
    });

    socket.on("chat:message", (data) => {
      if (!data?.workspaceId) return;

      io.to(`workspace:${data.workspaceId}`).emit(
        "chat:message",
        data
      );
    });

    socket.on("chat:typing", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("chat:typing", data);
    });

    socket.on("chat:stop-typing", (data) => {
      if (!data?.workspaceId) return;

      socket
        .to(`workspace:${data.workspaceId}`)
        .emit("chat:stop-typing", data);
    });

    socket.on("activity:new", (data) => {
      if (!data?.workspaceId) return;

      io.to(`workspace:${data.workspaceId}`).emit(
        "activity:new",
        data
      );
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  httpServer
    .once("error", (error) => {
      console.error(error);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(
        `> PulseBoard ready on http://${hostname}:${port}`
      );
      console.log("> Socket.IO server ready");
    });
});