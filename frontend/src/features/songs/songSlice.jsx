import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import songService from "./songService";

const initialState = {
    allSongs: [],
    allPlaylists: [],
    currentSong: null,
    nationality: [],
    language: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const fetch_songs = createAsyncThunk(
    "songs/fetch_songs",
    async (sendingData, thunkAPI) => {
        try {
            return await songService.fetch_songs(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const fetch_playlists = createAsyncThunk(
    "songs/fetch_playlists",
    async (sendingData, thunkAPI) => {
        try {
            return await songService.fetch_playlists(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const create_playlist = createAsyncThunk(
    "songs/create_playlists",
    async (sendingData, thunkAPI) => {
        try {
            return await songService.create_playlist(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const delete_playlist = createAsyncThunk(
    "songs/delete_playlist",
    async (sendingData, thunkAPI) => {
        try {
            return await songService.delete_playlist(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const alter_playlist = createAsyncThunk(
    "songs/alter_playlist",
    async (sendingData, thunkAPI) => {
        try {
            return await songService.alter_playlist(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const select_song = createAsyncThunk(
    "songs/select_song",
    async (sendingData, thunkAPI) => {
        return sendingData
    }
)

export const send_nationality = createAsyncThunk(
    "songs/send_nationality",
    async (_, thunkAPI) => {
        try {
            return await songService.send_nationality()
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const send_language = createAsyncThunk(
    "songs/send_language",
    async (_, thunkAPI) => {
        try {
            return await songService.send_language()
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const createSong = createAsyncThunk(
    "auth/createSong",
    async (userData, thunkAPI) => {
        try {
            return await songService.createSong(userData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()

            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const songSlice = createSlice({
    name: "songs",
    initialState,
    reducers: {
        reset: (state) => {
            state.allSongs = []
            state.allPlaylists = []
            state.currentSong = null
            state.nationality = []
            state.language = []
            state.isLoading = false
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetch_songs.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetch_songs.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.allSongs = action.payload.songs
            })
            .addCase(fetch_songs.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.allSongs = []
            }).addCase(fetch_playlists.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetch_playlists.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.allPlaylists = action.payload.playlists
            })
            .addCase(fetch_playlists.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.allPlaylists = []
            }).addCase(create_playlist.pending, (state) => {
                state.isLoading = true
            })
            .addCase(create_playlist.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(create_playlist.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            }).addCase(select_song.pending, (state) => {
                state.isLoading = true
            })
            .addCase(select_song.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.currentSong = action.payload
            })
            .addCase(select_song.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.currentSong = null
            }).addCase(send_nationality.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.nationality = action.payload.nationality
            })
            .addCase(send_nationality.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.nationality = []
            }).addCase(send_language.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.language = action.payload.languages
            })
            .addCase(send_language.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
                state.language = []
            })
    }
})




export const { reset } = songSlice.actions

export default songSlice.reducer