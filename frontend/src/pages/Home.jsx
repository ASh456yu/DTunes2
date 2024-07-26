import { useState, useRef, useEffect } from "react"
import "../styles/Home.css"
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Library from "../screens/Library"
import Playlist from "../screens/Playlist"
// import Trending from "../screens/Trending"
import Player from "../screens/Player"
import Sidebar from "../components/sidebar/index"
import Songplayer from "../components/songplayer/index"
import { useSelector } from 'react-redux'
import { getUserInfo, getAllArtists } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { fetch_songs, fetch_playlists, send_nationality, send_language } from "../features/songs/songSlice"
import { useNavigate } from "react-router-dom"
import IndividualP from "../screens/IndividualP"
import { isPlay, setCurrSong, like_manage, dlike_manage, setSongStatus } from "../features/player/playerSlice"
import Profile from "../screens/Profile"
import Friends from "../screens/Friends"
import FriendPage from "../screens/FriendPage"

function Home() {
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    const { isPlaying, currSong, songStatus } = useSelector((state) => state.player)

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate()

    const audioRef = useRef(null);
    const [songDuration, setSongDuration] = useState(0);


    useEffect(() => {
        dispatch(getUserInfo()).unwrap()
            .then((data) => {
                dispatch(fetch_songs(data))
                dispatch(fetch_playlists(data))
                dispatch(send_nationality())
                dispatch(send_language())
                dispatch(getAllArtists())
            }).catch((error) => {
                navigate("/login")
            });
        if (currSong != null) {
            const handleTimeUpdate = () => {
                if (audioRef.current && audioRef.current.duration == audioRef.current.currentTime) {
                    dispatch(isPlay())
                    audioRef.current.pause()
                    console.log("ended");
                }
                if (audioRef.current && audioRef.current.duration) {
                    const currentTime = audioRef.current.currentTime;
                    const duration = audioRef.current.duration;
                    const newWidth = (currentTime / duration) * 100;
                    setSongDuration(newWidth);
                }
            };

            const audioElement = audioRef.current;
            if (audioElement) {
                audioElement.addEventListener('timeupdate', handleTimeUpdate);
                return () => {
                    audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                };
            }
        }



    }, [dispatch, currSong])

    const handlePlay = () => {
        if (isPlaying && audioRef.current) {
            dispatch(isPlay())
            audioRef.current.pause()
        } else if (!isPlaying && audioRef.current) {
            dispatch(isPlay())
            audioRef.current.play()
        }
    }

    const rewindAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
        }
    }

    const skipAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 5);
        }
    }

    const handleExcessControl = () => {
        if (songStatus == 0) {
            dispatch(setSongStatus())
            audioRef.current.loop = false
        } else if (songStatus == 1) {
            dispatch(setSongStatus())
            audioRef.current.loop = true
        }
    }

    const handleLike = async () => {
        dispatch(like_manage({
            user_id: userInfo.id,
            song_id: currSong.id
        }))
    }

    const handleDLike = async () => {
        dispatch(dlike_manage({
            user_id: userInfo.id,
            song_id: currSong.id
        }))
    }

    return (
        <div className="main-body">
            <Sidebar />
            <Routes>
                <Route path="/" element={<Library handlePlay={handlePlay} setSongDuration={setSongDuration} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/playlist" element={<Playlist />} />
                <Route path="/playlist/:id" element={<IndividualP />} />

                {/*
                <Route path="/trending" element={<Trending />} />
                <Route path="/playlist/:id" element={<IndividualP />} /> */}

                <Route path="/player" element={<Player
                    handlePlay={handlePlay}
                    rewindAudio={rewindAudio}
                    skipAudio={skipAudio}
                    handleLike={handleLike}
                    handleDLike={handleDLike}
                    songDuration={songDuration}
                    currentDuration={audioRef.current == null ? 0.0 : audioRef.current.currentTime}
                    totalDuration={audioRef.current == null ? 0.0 : audioRef.current.duration}
                    handleExcessControl={handleExcessControl}
                />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/friends/:id" element={<FriendPage />} />
            </Routes>

            {currSong != null && location.pathname !== '/player' && <Songplayer
                handlePlay={handlePlay}
                rewindAudio={rewindAudio}
                skipAudio={skipAudio} />}
            {currSong != null && <audio ref={audioRef} id="myaudio" src={`${apiUrl}/media/${currSong.song_file}`} />}
        </div>
    )

}

export default Home