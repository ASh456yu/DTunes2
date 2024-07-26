import "../styles/Playlist.css"
import { MdDelete } from "react-icons/md";
import { IconContext } from "react-icons"
import { SlOptionsVertical } from "react-icons/sl"
import { useEffect, useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaRegEye, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { create_playlist, fetch_playlists } from "../features/songs/songSlice";
import { toast } from "react-toastify";



function Playlist() {
    const navigate = useNavigate();
    const { allSongs, allPlaylists } = useSelector((state) => state.songs)
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)


    const handleNav = (query) => {
        navigate(`/playlist/${query}`)
    }


    const handleAddPlaylist = async () => {
        if (allPlaylists.length < 7) {
            dispatch(create_playlist(userInfo)).unwrap().then((data) => {
                dispatch(fetch_playlists(userInfo))
            })

        } else {
            toast.info("You have reached the maximum allowed playlist")
        }
    };

    // const handleClick = (key) => {
    //     const copyArr = [...isEditable];
    //     copyArr.forEach((index, x) => {
    //         if (x != key) {
    //             copyArr[x] = false;
    //         } else {
    //             copyArr[x] = true;
    //         }
    //     })
    //     setIsEditable(copyArr);
    // }

    // const handleOnChange = (index, e) => {
    //     const copyPlaylists = [...playlists];
    //     copyPlaylists[index].playlist_name = e.target.value;
    //     setPlaylists(copyPlaylists);
    // }

    // const handleOnKeyUp = async (index, e, playlist_id) => {
    // if (e.key == "Enter") {
    // const copyEditable = [...isEditable]
    // copyEditable[index] = false
    // try {
    //     const response = await axios.post(`${apiUrl}/songmanage/update_playlist/`, {
    //         name: e.target.value,
    //         id: playlist_id
    //     }, {
    //         headers: {
    //             "X-CSRFToken": csrfToken,
    //             "Content-Type": "application/json"
    //         },
    //         withCredentials: true
    //     });
    //     if (response.data.status === "ok") {
    //         console.log("Name Change Success");
    //     } else {
    //         console.log("Name Change Fail", response.data.error);
    //     }
    // } catch (error) {
    //     console.error("Error updating playlist name:", error);
    // }
    // setIsEditable(copyEditable)
    // fetchPlaylist()
    // }
    // }

    // const handleDeletePlaylist = async (playlist_id) => {
    // try {
    //     const response = await axios.post(`${apiUrl}/songmanage/delete_playlist/`, {
    //         id: playlist_id
    //     }, {
    //         headers: {
    //             "X-CSRFToken": csrfToken,
    //             "Content-Type": "application/json"
    //         },
    //         withCredentials: true
    //     });
    //     if (response.data.status === "ok") {
    //         console.log("Playlist deletion Success");
    //         fetchPlaylist()
    //     } else {
    //         console.log("Playlist deletion Fail", response.data.error);
    //     }
    // } catch (error) {
    //     console.error("Error Playlist deletion :", error);
    // }
    // }


    // const handleMoreOption = (index) => {
    //     if (document.getElementById(`view${index}`).style.display === "flex") {
    //         document.getElementById(`view${index}`).style.display = "none"
    //     } else {
    //         document.getElementById(`view${index}`).style.display = "flex"
    //     }

    // }

    useEffect(() => {

    }, [allPlaylists, userInfo, handleAddPlaylist])


    return (
        <div className="screen-container" >
            <IconContext.Provider value={{ size: "50px", className: "add-playlist" }}>
                <button onClick={handleAddPlaylist} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                    <IoAddCircleOutline />
                </button>
            </IconContext.Provider>
            <div className="playlist">
                {allPlaylists.map((playlist, index) => {
                    return (
                        <div key={index} className="playlists" onClick={()=>handleNav(playlist.id)}>
                            <p className="playlist-name">{playlist.playlist_name}</p>
                            {/* <IconContext.Provider value={{ size: "20px", className: "play-icon" }}>
                                <div>
                                    <button onClick={() => handleMoreOption(index)} style={{ background: 'none', border: 'none', padding: "10px", cursor: 'pointer' }}>
                                        <SlOptionsVertical />
                                    </button>
                                    <div className="view-more" id={`view${index}`}>
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={() => handleDeletePlaylist(playlist.id)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <MdDelete /> Delete
                                            </button>
                                        </IconContext.Provider>
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={() => { handleNav(playlist.id) }} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <FaRegEye /> View
                                            </button>
                                        </IconContext.Provider>
                                        <IconContext.Provider value={{ size: "20px" }}>
                                            <button onClick={() => handleClick(index)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: "black" }}>
                                                <FaPen /> Rename
                                            </button>
                                        </IconContext.Provider>
                                    </div>
                                </div>
                            </IconContext.Provider> */}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Playlist
