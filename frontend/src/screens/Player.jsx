import { useState, useRef, useEffect } from "react";
import "../styles/Player.css"
import { IconContext } from "react-icons"
import { FaPlay, FaPause } from "react-icons/fa"
import { FaForwardStep, FaBackwardStep } from "react-icons/fa6";
import { IoShuffle, IoRepeat, IoAddCircleOutline, IoAddCircleSharp } from "react-icons/io5"
import { BsRepeat1 } from "react-icons/bs"
import { BiLike, BiDislike, BiSolidLike, BiSolidDislike } from "react-icons/bi"
import { MdFavorite, MdFavoriteBorder, MdOutlinePlaylistAdd, MdOutlinePlaylistAddCheck } from "react-icons/md"
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { modify_playlist } from "../features/player/playerSlice";

function Player({
    handlePlay,
    handleDLike,
    handleLike,
    rewindAudio,
    skipAudio,
    songDuration,
    totalDuration,
    currentDuration,
    handleExcessControl
}) {

    const { isPlaying, currSong, songStatus } = useSelector((state) => state.player)
    const { allSongs, allPlaylists } = useSelector((state) => state.songs)
    const dispatch = useDispatch()
    const handlePlaylist = () => {
        if (document.getElementById("all-playlists").style.display == "none") {
            document.getElementById("all-playlists").style.display = "flex"
        } else {
            document.getElementById("all-playlists").style.display = "none"
        }
    }

    const handleAddToPlaylist = (playlistToBeModified, songToBeModified) => {
        dispatch(modify_playlist({
            playlist_id: playlistToBeModified.id,
            song_id: songToBeModified.id,
        })).unwrap().then((data) => {
            if (data.status == "ok") {
                if (data.action == "added") {
                    
                } else if (data.action == "removed") {
                    
                } 
            }
        })
    }

    return (
        <div className="screen-container player">
            <div className="song-info">
                <img src="/images/musiclogo.jpg" alt="Song Picture" className="song-img" />
            </div>
            <h2 className="song-title">
                {currSong != null && currSong.song_title}
            </h2>
            <h3 className="song-artist">
                Artist(s): {' '}
                {currSong != null && currSong.song_artist.map((artist, inde) => (
                    <Link key={'ar' + inde} to={"/dashboard"} className="artist-link">
                        {artist.name}{currSong.song_artist.length > inde + 1 ? ", " : ''}
                    </Link>
                ))}
            </h3>
            <div>
                {(currentDuration / 60.0).toFixed(2)}/{(totalDuration / 60.0).toFixed(2)}
            </div>
            <div className="progress-bar-back">
                <div className="progress-bar-progress" style={{ width: `${songDuration}%` }}></div>
            </div>
            <div className="audio-control">
                <div className="excess-control">
                    <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                        {currSong != null && currSong.has_liked ? <BiSolidLike onClick={handleLike} /> : <BiLike onClick={handleLike} />}
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                        {currSong != null && currSong.has_dliked ? <BiSolidDislike onClick={handleDLike} /> : <BiDislike onClick={handleDLike} />}
                    </IconContext.Provider>
                </div>
                <div className="main-control">
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        <FaBackwardStep onClick={rewindAudio} />
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        {isPlaying ? <FaPause onClick={handlePlay} /> : <FaPlay onClick={handlePlay} />}
                    </IconContext.Provider>
                    <IconContext.Provider value={{ size: "40px", className: "play-icon" }}>
                        <FaForwardStep onClick={skipAudio} />
                    </IconContext.Provider>
                </div>

                <div className="excess-control">
                    <IconContext.Provider value={{ size: "25px", className: "play-icon" }} >
                        {songStatus == 0 ? <BsRepeat1 onClick={handleExcessControl} /> : <IoRepeat onClick={handleExcessControl} />}
                    </IconContext.Provider>

                    <IconContext.Provider value={{ size: "25px", className: "play-icon" }} >
                        <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }} onClick={handlePlaylist}>
                            <MdOutlinePlaylistAdd />
                        </button>
                        <div className="all-playlists" id="all-playlists">
                            {allPlaylists.map((plist, index) => {
                                if (currSong != null && plist.all_songs.indexOf(currSong.id) != -1) {
                                    return (
                                        <button className="all-playlists-btn" onClick={() => handleAddToPlaylist(plist, currSong)} key={index} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                            {plist.playlist_name}
                                        </button>
                                    )
                                } else if (currSong != null) {
                                    return (
                                        <button className="all-playlists-btn" onClick={() => handleAddToPlaylist(plist, currSong)} key={index} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "grey" }}>
                                            {plist.playlist_name}
                                        </button>
                                    )
                                }
                            })}
                        </div>
                    </IconContext.Provider>
                </div>
            </div>
        </div>
    )
}

export default Player
