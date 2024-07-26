import axios from "axios"

const DOMAIN_BACKEND = "http://localhost:8000"

const FETCH_SONGS_URL = `${DOMAIN_BACKEND}/songs/send_songs/`
const FETCH_PLAYLISTS_URL = `${DOMAIN_BACKEND}/songs/send_playlist/`
const CREATE_PLAYLISTS_URL = `${DOMAIN_BACKEND}/songs/create_playlist/`
const DELETE_PLAYLISTS_URL = `${DOMAIN_BACKEND}/songs/delete_playlist/`
const ALTER_PLAYLISTS_URL = `${DOMAIN_BACKEND}/songs/alter_playlist/`
const GET_NATIONALITY_URL = `${DOMAIN_BACKEND}/songs/send_nationality/`
const GET_LANGUAGES_URL = `${DOMAIN_BACKEND}/songs/send_language/`
const CREATE_SONG_URL = `${DOMAIN_BACKEND}/songs/songsview/`

// Fetch all Songs
const fetch_songs = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(FETCH_SONGS_URL, sendingData, config)
    return response.data
}

// Fetch all Playlists
const fetch_playlists = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(FETCH_PLAYLISTS_URL, sendingData, config)
    return response.data
}

// Create Playlist
const create_playlist = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(CREATE_PLAYLISTS_URL, sendingData, config)
    return response.data
}

// Delete Playlist
const delete_playlist = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(DELETE_PLAYLISTS_URL, sendingData, config)
    return response.data
}


// Alter Playlist
const alter_playlist = async (sendingData) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(ALTER_PLAYLISTS_URL, sendingData, config)
    return response.data
}

// Send Nationality
const send_nationality = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(GET_NATIONALITY_URL, config)
    return response.data
}

// Send Languages
const send_language = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const response = await axios.post(GET_LANGUAGES_URL, config)
    return response.data
}


// Create Song
const createSong = async (userData) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.post(CREATE_SONG_URL, userData, config)

    return response.data
}




const songService = { fetch_songs, fetch_playlists, create_playlist, send_nationality, send_language, createSong, alter_playlist, delete_playlist }

export default songService
