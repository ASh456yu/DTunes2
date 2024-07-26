import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import playerService from "./playerService"

const initialState = {
    isPlaying: false,
    currSong: null,
    songStatus: 1,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
}

export const like_manage = createAsyncThunk(
    "player/like_manage",
    async (sendingData, thunkAPI) => {
        try {
            return await playerService.like_manage(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const dlike_manage = createAsyncThunk(
    "player/dlike_manage",
    async (sendingData, thunkAPI) => {
        try {
            return await playerService.dlike_manage(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const modify_playlist = createAsyncThunk(
    "player/modify_playlist",
    async (sendingData, thunkAPI) => {
        try {
            return await playerService.modify_playlist(sendingData)
        } catch (error) {
            const message = (error.response && error.response.data
                && error.response.data.message) ||
                error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)




export const playerSlice = createSlice({
    name: "player",
    initialState,
    reducers: {
        isPlay: (state) => {
            state.isPlaying = !state.isPlaying
        },
        setCurrSong: (state, action) => {
            state.currSong = action.payload
        },
        setSongStatus: (state) => {
            if (state.songStatus == 0) {
                state.songStatus = 1
            } else if (state.songStatus == 1) {
                state.songStatus = 0
            }
        },
        reset: (state) => {
            state.isPlaying = false
            state.currSong = null
            state.isLoading = false
            state.songStatus = 1
            state.isError = false
            state.isSuccess = false
            state.message = false
        }
    },
    extraReducers: (builder) => {
        builder.addCase(like_manage.pending, (state) => {
            state.isLoading = true
        })
            .addCase(like_manage.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
                state.currSong.has_liked = !state.currSong.has_liked
            })
            .addCase(like_manage.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            }).addCase(dlike_manage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(dlike_manage.fulfilled, (state) => {
                state.isLoading = false
                state.isSuccess = true
                state.currSong.has_dliked = !state.currSong.has_dliked
            })
            .addCase(dlike_manage.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            }).addCase(modify_playlist.pending, (state) => {
                state.isLoading = true
            })
            .addCase(modify_playlist.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
            })
            .addCase(modify_playlist.rejected, (state, action) => {
                state.isLoading = false
                state.isSuccess = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const { isPlay, setCurrSong, setSongStatus, reset } = playerSlice.actions

export default playerSlice.reducer
