const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();
const users = []; // 本番ではDBに保存推奨

// ユーザー登録
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  users.push({ username, password: hashed });
  res.json({ message: "登録完了" });
});

// ログイン
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "認証失敗" });
  }
  const token = jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

module.exports = router;
