const express = require("express");
const connectDB = require("./Database/connectDB.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* ---------------- BASIC MIDDLEWARE ---------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- CORS FIX (IMPORTANT) ---------------- */

app.use(
  cors({
    origin: [
      "https://frontendfinal-rilz2dzuh-rachnabalunis-projects.vercel.app",
      "https://frontendfinal-olive.vercel.app"
    ],
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */

app.use("/api/player", require("./Route/Player.route.js"));
app.use("/api/member", require("./Route/Member.route.js"));
app.use("/api/event", require("./Route/Event.route.js"));
app.use("/api/admin", require("./Route/Admin.route.js"));
app.use("/api/team", require("./Route/Team.route.js"));

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 3002;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log("🚀 Server running on port:", PORT);
      console.log("🌐 CORS enabled for frontend");
    });
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

/* ---------------- ERROR HANDLER ---------------- */

app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});