const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./auth");
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));
app.use("/auth", authRoutes);

let votes = { yes: 0, no: 0 };

io.on("connection", (socket) => {
  console.log("ユーザー接続");

  socket.on("comment", (data) => {
    try {
      const decoded = jwt.verify(data.token, process.env.SECRET_KEY);
      io.emit("comment", `${decoded.username}: ${data.text}`);
    } catch {
      socket.emit("error", "認証エラー");
    }
  });

  socket.on("vote", (choice) => {
    votes[choice]++;
    io.emit("results", votes);
  });
});

server.listen(3000, () => {
  console.log("サーバー起動: http://localhost:3000");
});
