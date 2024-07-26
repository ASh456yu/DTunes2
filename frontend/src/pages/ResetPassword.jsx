import { useState, useEffect } from "react"
import { FaRegUser } from "react-icons/fa"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../components/Loader"
import { resetPassword } from "../features/auth/authSlice"

const ResetPassword = () => {

    const [formData, setFormData] = useState({
        "email": "",
    })

    const { email } = formData

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
            email
        }
        dispatch(resetPassword(userData))
    }

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        if (isSuccess) {
            navigate("/")
            toast.success("A reset password email has been sent.")
        }
    }, [isError, isSuccess, message, navigate, dispatch])

    return (
        <div className="container auth__container">
            <h1 className="main__title"> Reset Password <FaRegUser /></h1>
            <form className="auth__form">
                <input type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={email}
                    required
                />
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <button className="btn btn-primary" type="submit" onClick={handleSubmit}>Reset Password</button>
                    </>
                )}
            </form>
        </div>
    )
}

export default ResetPassword
