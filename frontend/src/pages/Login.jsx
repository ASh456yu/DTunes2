import React from 'react'
import { useState, useEffect } from 'react'
import { IoIosLogIn } from "react-icons/io"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { login, reset, getUserInfo } from "../features/auth/authSlice"
import Loader from '../components/Loader'
import { toast } from 'react-toastify'

const Login = () => {
    const [formData, setFormData] = useState({
        "email": "",
        "password": "",
    })

    const { email, password } = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        })
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const userData = {
            email,
            password,
        }
        dispatch(login(userData))
    }


    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess || (user != undefined && user.first_name != undefined)) {
            navigate("/")
        }

        dispatch(reset())
        dispatch(getUserInfo())

    }, [isError, isSuccess, user, navigate, dispatch])

    return (
        <div className="container auth__container">
            <h1 className="main__title">Login <IoIosLogIn /></h1>
            <form className="auth__form">
                <input type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={email}
                    required
                />
                <input type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={password}
                    required
                />
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Link to="/password/reset">Forget Password?</Link>
                        <Link to="/register">New to DTunes? Please Register</Link>
                        <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Login</button>
                    </>
                )}
            </form>
        </div>
    )
}

export default Login