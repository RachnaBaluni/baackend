const express = require("express");
const connectDB = require("./Database/connectDB.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* CORS */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://frontendfinal-olive.vercel.app"
    ],
    credentials: true,
  })
);

/* Routes */
app.use("/api/player", require("./Route/Player.route.js"));
app.use("/api/member", require("./Route/Member.route.js"));
app.use("/api/event", require("./Route/Event.route.js"));
app.use("/api/admin", require("./Route/Admin.route.js"));
app.use("/api/team", require("./Route/Team.route.js"));

/* Server */
const PORT = process.env.PORT || 3002;

connectDB()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
})
.catch((err)=>{
 console.log(err);
});