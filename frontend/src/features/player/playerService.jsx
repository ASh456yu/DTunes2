import axios from "axios"

const DOMAIN_BACKEND = "http://localhost:8000"

const LIKES_MANAGE = `${DOMAIN_BACKEND}/songs/likes_manage/`
const DISLIKES_MANAGE = `${DOMAIN_BACKEND}/songs/dlikes_manage/`
const MODIFY_PLAYLIST_URL = `${DOMAIN_BACKEND}/songs/modify_playlist/`

// Manage Likes
const like_manage = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(LIKES_MANAGE, sendingData, config)
    return response.data
}

// Manage Dislikes
const dlike_manage = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(DISLIKES_MANAGE, sendingData, config)
    return response.data
}

// Modify Playlist
const modify_playlist = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(MODIFY_PLAYLIST_URL, sendingData, config)
    return response.data
}


const playerService = { like_manage, dlike_manage, modify_playlist }

export default playerService