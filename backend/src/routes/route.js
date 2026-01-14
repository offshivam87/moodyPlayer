const { Router } = require("express")
const { analyzeMoodWithGemini } = require("../services/ai.service")
const songModel = require("../models/song.model")
const uploadFile = require("../services/imagekit")
const multer = require("multer")

const router = Router()

const upload = multer({storage:multer.memoryStorage()})

// agar multiple files bhejni ho to fir hm log upload.single ki jagah upload.array likhte h


router.post('/upload',upload.single("song"), async (req,res)=>{
    console.log(req.body);
    console.log(req.file);
    const fileData =await uploadFile(req.file)
   const song = await songModel.create({
    title:req.body.title,
    artist: req.body.artist, 
    audio:fileData.url,
    mood : req.body.mood
   }) 

    
    res.status(201).json({
        message :'song created successfully',
        song : song
    })
    

})


router.post("/songs",async (req,res)=>{
    const {image} = req.body
    
    
    const mood = await analyzeMoodWithGemini(image)
    res.json({
        mood:mood
    })

})

router.get('/songs',async(req,res)=>{
    const {mood}= req.query
    const songs = await songModel.find({
        mood:mood
    })

    if(songs.length===0){
        return res.status(400).json({
            error:"server error",
        })
    }

    res.json({
        songs
    })

})



module.exports = router