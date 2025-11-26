import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase設定（Firebase Consoleからコピー）
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    token = await userCredential.user.getIdToken();
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
