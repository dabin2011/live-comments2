const express = require("express");
const app = express();
app.use(express.json());

const authRoutes = require("./auth");
app.use("/auth", authRoutes);

app.listen(3000, () => console.log("サーバー起動"));
