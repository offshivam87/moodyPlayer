import { useEffect, useRef, useState } from "react";
import axios from "axios"
import { FaPlay, FaPause } from "react-icons/fa";

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);

  const [isDetecting, setIsDetecting] = useState(false);
  const [isFetchingSongs, setIsFetchingSongs] = useState(false);
  const [mood, setMood] = useState(null);

  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);







  // Camera ON

  useEffect(() => {

    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();
    };
    startCamera()

  }, [])


  // Capture Image
  const captureImage = async () => {


    try {
      setIsDetecting(true);
      setIsFetchingSongs(false);
      setMood(null);
      setSongs([]);

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const base64 = canvas.toDataURL("image/jpeg");

      const response = await axios.post(
        "http://localhost:3000/songs",
        { image: base64 },
        { headers: { "Content-Type": "application/json" } }
      );

      const detectedMood = response.data?.mood;

      if (!detectedMood || detectedMood === "no face found") {
        alert("No face detected. Please look at the camera.");
        return;
      }

      setMood(detectedMood);
      setIsDetecting(false);
      setIsFetchingSongs(true);

      const songsResponse = await axios.get(
        `http://localhost:3000/songs?mood=${detectedMood}`
      );
      console.log(songsResponse);


      setSongs(songsResponse.data.songs); // 👈 backend should return array
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsDetecting(false);
      setIsFetchingSongs(false);
    }
  };


  return (
    <div className="min-h-screen bg-black flex   items-center pb-30 md:pb-0  justify-center px-6">
      <div
        className={`bg-zinc-900 md:mb-30 rounded-xl shadow-xl transition-all duration-500
  w-full max-w-5xl p-4 sm:p-6
  ${songs.length > 0 ? "grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6" : "max-w-sm mx-auto"}
`}
      >

        <div>
          <h1 className="text-white text-xl md:h-auto h-[2vh] font-semibold mb-4">
            Mood Detection
          </h1>

          <div className="rounded-lg overflow-hidden border border-zinc-700">
            <video
              ref={videoRef}
              className="w-full h-[220px] sm:h-[260px] object-cover"
            />
          </div>

          <button
            disabled={isDetecting || isFetchingSongs}
            onClick={captureImage}
            className="mt-4 w-full bg-green-400 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
          >
            {isDetecting
              ? "Detecting mood..."
              : isFetchingSongs
                ? "Fetching songs..."
                : "Detect Mood"}
          </button>

          {mood && (
            <div className="md:mt-4 bg-zinc-800 mt-2 p-1 border border-zinc-700 rounded-lg md:p-3 text-center">
              <p className="text-zinc-400 text-sm">Mood Detected</p>
              <p className="text-green-400 text-lg font-semibold mt-1">
                {mood.toUpperCase()}
              </p>
            </div>
          )}
        </div>


        {songs.length > 0 && (
          <div><h2 className="text-white rounded-2xl bg-zinc-800 border-zinc-800 md:py-5 py-3 text-center text-lg font-semibold mb-3">
            ↓ Recommended Songs ↓
          </h2>
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 overflow-y-auto h-[30vh] md:h-[60vh]">


              <ul className="space-y-3">
                {songs.map((song, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition
    ${currentSong?.title === song.title
                        ? "bg-indigo-600/20 border border-indigo-500"
                        : "bg-zinc-900 hover:bg-zinc-700"}
  `}
                    onClick={() => {
                      if (currentSong?.title === song.title) {
                        setCurrentSong(null);   // pause
                      } else {
                        setCurrentSong(song);  // play
                      }
                    }}
                  >

                    <div>
                      <p className="text-white font-medium text-sm">
                        {song.title}
                      </p>
                      <p className="text-zinc-400 text-xs">
                        {song.artist}
                      </p>
                    </div>

                    <span className="text-indigo-400 text-lg">
                      {currentSong?.title === song.title ? <FaPause /> : <FaPlay />}
                    </span>
                  </li>
                ))} 
              </ul>
            </div>
          </div>
        )}



        {currentSong && (
          <div className="
  fixed bottom-0 left-0 right-0
  md:bottom-6 md:left-1/2 md:-translate-x-1/2
  w-full md:w-[460px]
  bg-zinc-900/95 backdrop-blur-xl
  border-t md:border border-zinc-700
  rounded-none md:rounded-2xl
  md:mt-10
  px-4  pb-10 md:pb-3 pt-2 shadow-2xl
">

            {/* Song Info */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white text-sm font-semibold leading-tight">
                  {currentSong.title}
                </p>
                <p className="text-zinc-400 text-xs">
                  {currentSong.artist}
                </p>
              </div>
              <span className="text-xs text-zinc-500">Now Playing</span>
            </div>

            {/* Audio */}
            <audio
              key={currentSong.audio}
              src={currentSong.audio}
              controls
              autoPlay
              className="w-full h-9"
            />

          </div>
        )}






        <canvas ref={canvasRef} className="hidden" />
      </div>

    </div>
  );
};

export default Camera;
