const express = require("express")
const songModel = require("./models/song.model")
const router = require("./routes/route")
const cors = require("cors")

const app = express()
const allowedOrigins = [
  "http://localhost:5173",
  "https://moody-player-xi.vercel.app",
  "https://ai-moody-player.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json({ limit: "10mb" }))
app.use('/', router)

module.exports = app