const express = require("express")
const songModel = require("./models/song.model")
const router = require("./routes/route")
const cors = require("cors")

const app = express()
app.use(cors({
  origin: ["http://localhost:5173","https://moodyplayer-ei1v.onrender.com"],  // React frontend
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }))
app.use('/',router)

module.exports= app