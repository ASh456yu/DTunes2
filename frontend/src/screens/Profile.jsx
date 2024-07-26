import React, { useRef, useState, useEffect } from 'react'
import "../styles/Profile.css"
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo, getUserMoreInfo, getAllArtists } from '../features/auth/authSlice'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUser } from '../features/auth/authSlice';
import { createSong } from '../features/songs/songSlice';

function Profile() {
    const dispatch = useDispatch()
    const { userInfo, userMoreInfo, allArtists } = useSelector((state) => state.auth)
    const { allSongs, allPlaylists, currentSong, nationality, language } = useSelector((state) => state.songs)
    const inputRef = useRef()
    const songRef = useRef()
    const [imageChanged, setImageChanged] = useState(0)

    const [userDatas, setUserDatas] = useState({
        first_name: "",
        last_name: "",
        email: "",
        date_of_birth: "",
        nationality: "",
        profile_image: ""
    })


    const [songDatas, setSongDatas] = useState({
        title: "",
        artist: [],
        language: [],
        song: "",
    })

    const handleInputClick = () => {
        inputRef.current.click()
    }

    const handleInputChange = (e) => {
        const file = e.target.files[0]
        setUserDatas((prev) => ({
            ...prev,
            profile_image: file
        }));
        setImageChanged(1)
    }

    const handleSongInputChange = (e) => {
        const file = e.target.files[0]
        setSongDatas((prev) => ({
            ...prev,
            song: file
        }));
    }

    const handleReg = (e) => {
        let x = document.getElementsByClassName('reg-topic')
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            element.style.display = 'block'
        }
        e.target.style.display = "none"
    }

    const handleArtistReg = async (e) => {
        e.preventDefault()

        if (imageChanged == 1) {
            dispatch(updateUser({
                id: userInfo.id,
                first_name: userDatas.first_name,
                last_name: userDatas.last_name,
                date_of_birth: userDatas.date_of_birth,
                nationality: userDatas.nationality,
                profile_image: userDatas.profile_image
            })).unwrap().then((data) => {
                if (data.status == 201) {
                    toast.success("User Info Updated")
                } else {
                    toast.error("Something wrong happened")
                }
            });
        } else {
            dispatch(updateUser({
                id: userInfo.id,
                first_name: userDatas.first_name,
                last_name: userDatas.last_name,
                date_of_birth: userDatas.date_of_birth,
                nationality: userDatas.nationality,
            })).unwrap().then((data) => {
                if (data.status == 201) {
                    toast.success("User Info Updated")
                } else {
                    toast.error("Something wrong happened")
                }
            });;
        }


    }

    const handleUploadElements = (e) => {
        let x = document.getElementsByClassName('upload-songs')
        for (let i = 0; i < x.length; i++) {
            const element = x[i];
            element.style.display = 'block'
        }
        e.target.style.display = "none"
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (songDatas.song != "") {
            dispatch(createSong({
                title: songDatas.title,
                artist: songDatas.artist,
                language: songDatas.language,
                song: songDatas.song,
            })).unwrap().then((data) => {
                if (data.status == 201) {
                    toast.success("Created Uploaded Successfully")
                } else {
                    toast.error("Something wrong happened")
                }
            });
        } else {
            toast.error("Song not selected")
        }


    }

    const handleChange = (e) => {
        setUserDatas((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSongChange = (e) => {
        setSongDatas((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSelectChange = (e) => {
        setUserDatas((prev) => ({
            ...prev,
            nationality: parseInt(e.target.value),
        }));
    };

    const handleSongSelectChange = (e) => {
        if (e.target.value.split(",")[0] != "-1") {
            setSongDatas((prev) => ({
                ...prev,
                language: [...prev.language, {
                    "id": parseInt(e.target.value.split(",")[0]),
                    "language": e.target.value.split(",")[1],
                }],
            }));
        }
    };

    const handleArtistSelectChange = (e) => {
        if (e.target.value.split(",")[0] != "-1") {
            setSongDatas((prev) => ({
                ...prev,
                artist: [...prev.artist, {
                    "id": parseInt(e.target.value.split(",")[0]),
                    "first_name": e.target.value.split(",")[1],
                }],
            }));
        }

    };

    useEffect(() => {
        if (!userInfo.first_name || !userMoreInfo.profile_image) {
            dispatch(getUserInfo()).unwrap().then((data) => {
                setUserDatas((prev) => ({
                    ...prev,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    email: data.email,
                }))
                dispatch(getUserMoreInfo({ id: data.id })).unwrap().then((data) => {
                    setUserDatas((prev) => ({
                        ...prev,
                        profile_image: `http://localhost:8000/${data.user_data.profile_image}`,
                    }))
                    if (data.user_data.is_artist) {
                        setUserDatas((prev) => ({
                            ...prev,
                            date_of_birth: data.user_data.date_of_birth,
                            nationality: data.user_data.nationality[0].id,
                        }))
                    }
                    dispatch(getAllArtists())
                })
            })
        } else {
            setUserDatas((prev) => ({
                ...prev,
                first_name: userInfo.first_name,
                last_name: userInfo.last_name,
                email: userInfo.email,
                profile_image: `http://localhost:8000/${userMoreInfo.profile_image}`,
            }))
            if (userMoreInfo.is_artist) {
                setUserDatas((prev) => ({
                    ...prev,
                    date_of_birth: userMoreInfo.date_of_birth,
                    nationality: userMoreInfo.nationality[0].id,
                }))
            }
        }
    }, [dispatch, userInfo, userMoreInfo, allArtists])

    return (
        <div className='screen-container prof'>
            {imageChanged === 0 ? (
                <img className='prof-img' src={userDatas.profile_image} alt="Your Profile" onClick={handleInputClick} />
            ) : (
                <img className='prof-img' src={URL.createObjectURL(userDatas.profile_image)} alt="Your Profile" onClick={handleInputClick} />
            )}

            <input ref={inputRef} type="file" name="img" onChange={handleInputChange} accept="image/png, image/jpeg, image/jpg" style={{ display: "none" }} />
            {userMoreInfo.is_artist ?
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", width: "98%" }}>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <input type="text" name="first_name" placeholder='First Name' className='prof-fname user-data' value={userDatas.first_name || ''} onChange={handleChange} />
                        <input type="text" name="last_name" placeholder='Last Name' className='prof-lname user-data' value={userDatas.last_name || ''} onChange={handleChange} />
                        <input type="email" name="email" placeholder='Email Address' className='prof-email user-data' value={userDatas.email || ''} disabled />
                        <input type="date" name="date_of_birth" placeholder='Date of birth' className='prof-dob user-data reg-topic' value={userDatas.date_of_birth || ''} onChange={handleChange} />
                        <select className='user-data reg-topic' style={{ width: "210px" }} onChange={handleSelectChange} value={userDatas.nationality}>
                            {nationality.map((nation, index) => <option key={index + 1 + "n"} value={nation.id} >{nation.country_name}</option>)}
                        </select>
                        <button className='btn btn-primary prof-btn' style={{ marginTop: "10px", width: "80px", height: "30px", fontSize: "10px" }} onClick={handleArtistReg}>Save</button>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <button className='btn btn-primary prof-btn' style={{ marginTop: "10px", width: "150px", height: "30px", fontSize: "10px" }} onClick={handleUploadElements}>Upload Songs</button>
                        <input type="text" name="title" placeholder='Song Title' className='artist-song-title user-data upload-songs' onChange={handleSongChange} />


                        <div className='user-data upload-songs' style={{ paddingLeft: "10px", overflowY: "hidden", overflowX: "scroll", scrollbarWidth: "none", whiteSpace: "nowrap", alignContent: "center", color: "white" }}>
                            {songDatas.artist.map((art, index) => <div key={index + 1 + "sa"} style={{ width: "70px", height: "22px", backgroundColor: "black", fontSize: "12px", borderRadius: "2px", marginRight: "10px", display: "inline-block" }}>
                                {art.first_name.substring(0, 5) + "..."}
                            </div>)}
                        </div>
                        <select className='user-data upload-songs' style={{ width: "210px" }} onChange={handleArtistSelectChange}>
                            <option value={"-1,none"} >--None Artist Selected--</option>
                            {allArtists.map((art, index) => <option key={index + 1 + "a"} value={`${art.id},${art.first_name}`} >{art.first_name}</option>)}
                        </select>


                        <div className='user-data upload-songs' style={{ paddingLeft: "10px", overflowY: "hidden", overflowX: "scroll", scrollbarWidth: "none", whiteSpace: "nowrap", alignContent: "center", color: "white" }}>
                            {songDatas.language.map((lang, index) => <div key={index + 1 + "la"} style={{ width: "70px", height: "22px", backgroundColor: "black", fontSize: "12px", borderRadius: "2px", marginRight: "10px", display: "inline-block" }}>
                                {lang.language.substring(0, 5) + "..."}
                            </div>)}
                        </div>
                        <select className='user-data upload-songs' style={{ width: "210px" }} onChange={handleSongSelectChange}>
                            <option value={"-1,none"} >--None Language Selected--</option>
                            {language.map((langua, index) => <option key={index + 1 + "l"} value={`${langua.id},${langua.language}`} >{langua.language}</option>)}
                        </select>


                        {songDatas.song === '' ? (
                            <audio controls className='upload-songs' src="#" style={{ width: "210px", height: "40px" }}></audio>
                        ) : (
                            <audio controls className='upload-songs' src={URL.createObjectURL(songDatas.song)} style={{ width: "210px", height: "40px" }} />
                        )}
                        <input className='upload-songs' ref={songRef} type="file" name="song" onChange={handleSongInputChange} accept="audio/mp3, audio/mp4" style={{ marginTop: "10px" }} />
                        <button className='btn btn-primary prof-btn upload-songs' style={{ marginTop: "10px", width: "150px", height: "30px", fontSize: "10px", display: "none" }} onClick={handleUpload}>Upload</button>
                    </div>
                </div>

                : <div style={{ display: 'flex', flexDirection: 'column', width: "100%", alignItems: "center" }}>
                    <input type="text" name="first_name" placeholder='First Name' className='prof-fname user-data2' value={userDatas.first_name || ''} onChange={handleChange} />
                    <input type="text" name="last_name" placeholder='Last Name' className='prof-lname user-data2' value={userDatas.last_name || ''} onChange={handleChange} />
                    <input type="email" name="email" placeholder='Email Address' className='prof-email user-data2' value={userDatas.email || ''} disabled />

                    <button className='btn btn-primary prof-btn' style={{ marginTop: "10px" }} onClick={handleReg}>Register as Artist</button>
                    <input type="date" name="date_of_birth" placeholder='Date of birth' className='prof-dob user-data reg-topic' style={{ display: "none", width: "500px", fontSize: "20px" }} value={userDatas.date_of_birth || ''} onChange={handleChange} />
                    <select className='user-data2 reg-topic' style={{ width: "500px", display: "none" }} onChange={handleSelectChange} value={userDatas.nationality}>
                        {nationality.map((nation, index) => <option key={index + 1 + "n"} value={nation.id} >{nation.country_name}</option>)}
                    </select>
                    <button className='btn btn-primary prof-btn' style={{ marginTop: "10px" }} onClick={handleArtistReg}>Save</button>
                </div>

            }

        </div>
    )
}

export default Profile
