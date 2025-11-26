const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Firebase Admin 初期化（Render環境変数にサービスアカウントJSONを設定）
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
});

let votes = { yes: 0, no: 0 };

io.on("connection", (socket) => {
  console.log("ユーザー接続");

  // コメント受信
  socket.on("comment", async (data) => {
    try {
      const decoded = await admin.auth().verifyIdToken(data.token);
      io.emit("comment", `${decoded.email}: ${data.text}`);
    } catch {
      socket.emit("error", "認証エラー");
    }
  });

  // 投票受信
  socket.on("vote", (choice) => {
    votes[choice]++;
    io.emit("results", votes);
  });
});

server.listen(3000, () => {
  console.log("サーバー起動: http://localhost:3000");
});
