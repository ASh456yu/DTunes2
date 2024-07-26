import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { getUserInfo } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'

function ProtectedRoute({ children }) {

    const [isAuthorized, setIsAuthorized] = useState(null)

    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)

    if (userInfo.first_name == undefined) {
        dispatch(getUserInfo())
    } else {
        return children
    }
}


export default ProtectedRoute
