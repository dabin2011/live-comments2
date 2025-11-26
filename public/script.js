const socket = io(); // Renderにデプロイ後は自動で接続
let token = null;

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  alert(data.message);
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();
  if (data.token) {
    token = data.token;
    alert("ログイン成功");
  } else {
    alert("ログイン失敗");
  }
}

function sendComment() {
  const input = document.getElementById("commentInput");
  if (!token) {
    alert("ログインしてください");
    return;
  }
  socket.emit("comment", { text: input.value, token });
  input.value = "";
}

socket.on("comment", (msg) => {
  const p = document.createElement("p");
  p.textContent = msg;
  document.getElementById("comments").appendChild(p);
});

function vote(choice) {
  socket.emit("vote", choice);
}

socket.on("results", (votes) => {
  document.getElementById("results").innerText =
    `賛成:${votes.yes} 反対:${votes.no}`;
});
