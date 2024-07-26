import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { resetPasswordConfirm } from '../features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { AiFillLock } from "react-icons/ai"
import Loader from '../components/Loader'



function ResetPasswordConfirm() {

    const { uid, token } = useParams()
    const [formData, setFormData] = useState({
        "new_password": "",
        "re_new_password": ""
    })

    const {new_password, re_new_password} = formData

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth)


    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const userData = {
            uid,
            token,
            new_password,
            re_new_password
        }
        dispatch(resetPasswordConfirm(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate("/")
            toast.success("Password reset success.")
        }
    }, [isError, isSuccess, message, navigate, dispatch])


    return (
        <div className="container auth__container">
            <h1 className="main__title">Reset Password Confirm <AiFillLock /></h1>

            <form className="auth__form">
                <input type="password"
                    placeholder="New Password"
                    name="new_password"
                    onChange={handleChange}
                    value={new_password}
                    required
                />
                <input type="password"
                    placeholder="Confirm New Password"
                    name="re_new_password"
                    onChange={handleChange}
                    value={re_new_password}
                    required
                />

                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Reset</button>

                    </>
                )}
            </form>
        </div>
    )
}

export default ResetPasswordConfirm
