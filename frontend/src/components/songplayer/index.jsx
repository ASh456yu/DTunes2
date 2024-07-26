import "./songplayer.css"
import { MdOutlinePlayCircleOutline, MdOutlinePauseCircle } from "react-icons/md";
import { IconContext } from "react-icons";
import { useState, useRef, useEffect } from "react";
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function songplayer({ handlePlay, rewindAudio, skipAudio }) {
    const navigate = useNavigate();
    const handleNav = () => {
        navigate("/player")
    }

    const { isPlaying, currSong } = useSelector((state) => state.player)

    return (
        <div className="song-player">
            <div className="song-player-title" onClick={handleNav}>
                <p>{currSong !=null && currSong.song_title}</p>
            </div>
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                <FaBackwardStep style={{ color: "black" }} onClick={rewindAudio} />
            </IconContext.Provider>
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                {isPlaying ?  <MdOutlinePauseCircle onClick={handlePlay} style={{ color: "black" }} /> : <MdOutlinePlayCircleOutline style={{ color: "black" }} onClick={handlePlay} />} 
            </IconContext.Provider>
            <IconContext.Provider value={{ size: "30px", className: "song-player-icon" }}>
                <FaForwardStep style={{ color: "black" }} onClick={skipAudio} />
            </IconContext.Provider>
        </div>
    )
}

export default songplayer
