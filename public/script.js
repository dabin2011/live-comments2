// Firebase SDKを読み込み
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase設定（Firebase Consoleからコピーした値を必ず入れる）
const firebaseConfig = {
  apiKey: "AIzaSyAjPP4jjWccHGaau5eG22I0HYbHp3V-ey4",
  authDomain: "live-comments-app.firebaseapp.com",
  projectId: "live-comments-app",
  storageBucket: "live-comments-app.appspot.com",
  messagingSenderId: "113751460330",
  appId: "1:113751460330:web:b185916c9d76265fd08a93"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Socket.IO接続
const socket = io();
let token = null;

// 新規登録
window.register = async function() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("登録成功");
  } catch (err) {
    alert("登録失敗: " + err.message);
  }
};

// ログイン
window.login = async function() {
  const email = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    token = await userCredential.user.getIdToken(); // JWTを取得
    alert("ログイン成功");
  } catch (err) {
    alert("ログイン失敗: " + err.message);
  }
};

// コメント送信
window.sendComment = function() {
  const input = document.getElementById("commentInput");
  if (!token) {
    alert("ログインしてください");
    return;
  }
  socket.emit("comment", { text: input.value, token });
  input.value = "";
};

// コメント受信
socket.on("comment", (msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  document.getElementById("comments").appendChild(p);
});

// 投票
window.vote = function(choice) {
  socket.emit("vote", choice);
};

// 投票結果受信
socket.on("results", (votes) => {
  document.getElementById("results").innerText =
    `賛成:${votes.yes} 反対:${votes.no}`;
});
