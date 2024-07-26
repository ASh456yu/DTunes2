import { useState, useEffect } from 'react'
import { FaRegUser } from "react-icons/fa"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaUserCheck } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux"
import { activate, reset } from "../features/auth/authSlice"
import { toast } from 'react-toastify'
import Loader from '../components/Loader';



const Activate = () => {

    const { uid, token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            uid,
            token
        }
        dispatch(activate(userData))
        toast.success("Your account has been activated! You can login now")
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate("/login")
        }

        dispatch(reset())

    }, [isError, isSuccess, navigate, dispatch])

    return (
        <div className="container auth__container">
            <h1 className="main__title">Account Activate <FaUserCheck /></h1>
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <button className="btn btn-primary btn-activate-account" type="submit" onClick={handleSubmit}>Activate</button>
                </>
            )}
        </div>
    )
}

export default Activate
