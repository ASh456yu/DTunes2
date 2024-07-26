import "../styles/IndividualP.css"
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetch_playlists, alter_playlist, delete_playlist } from "../features/songs/songSlice";
import { getUserInfo } from "../features/auth/authSlice";
import { toast } from "react-toastify";

function IndividualP() {

    const { id } = useParams();
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { allSongs, allPlaylists } = useSelector((state) => state.songs)
    const [psongs, setPSongs] = useState([]);
    const [currPlaylist, setCurrPlaylist] = useState({})
    const [plName, setPlName] = useState("")
    const handleOnchange = (e) => {
        setPlName(e.target.value)
    }

    const handleDelete = (e) => {
        e.preventDefault()
        dispatch(delete_playlist({ id: currPlaylist.id })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Playlist Deleted successfully")
                navigate("/playlist")
            } else {
                toast.error("Something went wrong")
            }
        })
    }


    const handleAlter = (e) => {
        e.preventDefault()
        dispatch(alter_playlist({ id: currPlaylist.id, pl_name: plName })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Playlist Saved successfully")
                navigate("/playlist")
            } else {
                toast.error("Something went wrong")
            }
        })
    }

    useEffect(() => {
        if (allPlaylists.length == 0) {
            dispatch(getUserInfo()).unwrap()
                .then((data) => {
                    dispatch(fetch_playlists(data)).unwrap().then((data) => {
                        if (data.status == 200) {

                            for (let i = 0; i < data.playlists.length; i++) {
                                const playlist = data.playlists[i];
                                if (playlist.id == id) {
                                    setPlName(playlist.playlist_name)
                                    setCurrPlaylist(playlist)
                                    setPSongs(playlist.all_songs)
                                    break;
                                }
                            }
                        }
                    })
                }).catch((error) => {

                });
        } else {
            for (let i = 0; i < allPlaylists.length; i++) {
                const playlist = allPlaylists[i];
                if (playlist.id == id) {
                    console.log(playlist);
                    setPlName(playlist.playlist_name)
                    setCurrPlaylist(playlist)
                    setPSongs(playlist.all_songs)
                    break
                }
            }
        }
    }, [setPSongs]);


    return (
        <div className="screen-container individualP">
            <div className="added_to_playlist">
                <div className="playlist-header">
                    <h1>Added to playlist</h1>
                    <div className="modify-playlist-btns">
                        <button onClick={handleAlter}>Save</button>
                        <button onClick={handleDelete}>Delete</button>
                        <button>Play</button>
                    </div>
                </div>
                {currPlaylist.id != undefined ? <>
                    <input type="text" name="pl_name" className="pl_name" value={plName} onChange={handleOnchange} />

                    <div style={{ width: "98%", height: "400px", overflowY: "scroll", scrollbarWidth: "none", overflowX: "hidden" }}>
                        {psongs.length > 0 ? psongs.map((song, index) => <div className="ply-songs" key={index}>
                            <p>{song.song_title}</p>
                            {song.song_artist.map((arts, index) => <p key={index}>{arts.name}</p>)}
                        </div>) : <div>No songs in the playlist.</div>}
                    </div>
                </> : ""}
            </div>
        </div>
    )
}

export default IndividualP
