import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'


const Dashboard = () => {

    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)
    if (userInfo.first_name == undefined) {
        dispatch(getUserInfo())
    }


    return (
        <div>
            <h1>Welcome, {userInfo.first_name} </h1>
        </div>
    )
}

export default Dashboard