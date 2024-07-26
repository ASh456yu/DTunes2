import axios from "axios"

const DOMAIN_BACKEND = "http://localhost:8000"

const REGISTER_URL = `${DOMAIN_BACKEND}/auth/users/`
const LOGIN_URL = `${DOMAIN_BACKEND}/auth/jwt/create/`
const ACTIVATE_URL = `${DOMAIN_BACKEND}/auth/users/activation/`
const RESET_PASSWORD_URL = `${DOMAIN_BACKEND}/auth/users/reset_password/`
const RESET_PASSWORD_CONFIRM_URL = `${DOMAIN_BACKEND}/auth/users/reset_password_confirm/`
const GET_USER_INFO_URL = `${DOMAIN_BACKEND}/auth/users/me/`
const GET_USER_MORE_INFO_URL = `${DOMAIN_BACKEND}/accounts/send_user_info/`
const UPDATE_USER_URL = `${DOMAIN_BACKEND}/accounts/update_user/`
const SEARCH_USER_URL = `${DOMAIN_BACKEND}/accounts/search_user/`
const SEND_ACCOUNT_URL = `${DOMAIN_BACKEND}/accounts/send_account/`
const MODIFY_FRND_REQUEST_URL = `${DOMAIN_BACKEND}/accounts/modify_frnd_request/`
const SEND_ALL_ARTISTS_URL = `${DOMAIN_BACKEND}/songs/send_all_artists/`



// Register user

const register = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(REGISTER_URL, userData, config)

    return response.data
}

// Login user

const login = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(LOGIN_URL, userData, config)

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data))
    }

    return response.data
}

// Logout 

const logout = () => {
    return localStorage.removeItem("user")
}

// Activate user

const activate = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(ACTIVATE_URL, userData, config)

    return response.data
}

// Reset Password

const resetPassword = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_URL, userData, config)

    return response.data
}

// Reset Password

const resetPasswordConfirm = async (userData) => {
    const config = {
        headers: {
            "Content-type": "application/json"
        }
    }

    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config)

    return response.data
}

// Get User Info

const getUserInfo = async (accessToken) => {
    const config = {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    }

    const response = await axios.get(GET_USER_INFO_URL, config)

    return response.data
}

// Get User More Info

const getUserMoreInfo = async (userData) => {
    const config = {
        headers: {
            "Content-type": 'multipart/form-data'
        }
    }

    const response = await axios.post(GET_USER_MORE_INFO_URL, userData, config)

    return response.data
}

// Get User More Info

const updateUser = async (userData) => {
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }

    const response = await axios.post(UPDATE_USER_URL, userData, config)

    return response.data
}


// Get All Artists

const getAllArtists = async () => {
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }

    const response = await axios.post(SEND_ALL_ARTISTS_URL, config)

    return response.data
}


// Search User

const searchUser = async (query) => {
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }

    const response = await axios.post(SEARCH_USER_URL, query, config)

    return response.data
}


// SEND ACCOUNT

const sendAccount = async (userData) => {
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }

    const response = await axios.post(SEND_ACCOUNT_URL, userData, config)

    return response.data
}


// MODIFY FRIEND REQUEST

const modifyFriendRequest = async (userData) => {
    const config = {
        headers: {
            "Content-type": 'application/json'
        }
    }

    const response = await axios.post(MODIFY_FRND_REQUEST_URL, userData, config)

    return response.data
}


const authService = { register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo, getUserMoreInfo, updateUser, getAllArtists, searchUser, sendAccount, modifyFriendRequest }

export default authService
