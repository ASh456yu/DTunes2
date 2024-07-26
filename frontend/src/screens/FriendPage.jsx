import React, { useEffect, useState } from 'react'
import "../styles/FriendPage.css"
import { useParams } from 'react-router-dom';
import { sendAccount } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { modifyFriendRequest } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

function FriendPage() {

    const { id } = useParams();
    const [userAccount, setUserAccount] = useState(null)
    const dispatch = useDispatch()
    const { userInfo } = useSelector((state) => state.auth)

    const send_friend_request = () => {
        dispatch(modifyFriendRequest({
            user_id1: userInfo.id,
            user_id2: id,
            action: "create"
        })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Friend Request Sent")
            } else {
                toast.error(" Something went wrong")
            }
        })
    }

    const unfollow = () => {
        dispatch(modifyFriendRequest({
            user_id1: userInfo.id,
            user_id2: id,
            action: "unfollow"
        })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Friend Unfollowed")
            } else {
                toast.error(" Something went wrong")
            }
        })
    }


    const accept_friend_request = () => {
        dispatch(modifyFriendRequest({
            user_id1: userInfo.id,
            user_id2: id,
            action: "accepted"
        })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Friend Request Accepted")
            } else {
                toast.error(" Something went wrong")
            }
        })
    }

    const reject_friend_request = () => {
        dispatch(sendFriendRequest({
            user_id1: userInfo.id,
            user_id2: id,
            action: "rejected"
        })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.warning("Friend Request Rejected")
            } else {
                toast.error(" Something went wrong")
            }
        })
    }

    const remove_friend_request = () => {
        dispatch(modifyFriendRequest({
            user_id1: userInfo.id,
            user_id2: id,
            action: "remove"
        })).unwrap().then((data) => {
            if (data.status == 201) {
                toast.success("Friend Request Deleted")
            } else {
                toast.error(" Something went wrong")
            }
        })
    }

    useEffect(() => {
        if (userAccount == null) {
            dispatch(sendAccount({
                "user_id": id,
                "user_id_sender": userInfo.id
            })).unwrap().then((data) => {
                if (data.status == 201) {
                    setUserAccount(data.send_account)
                }
            })
        }
    }, [send_friend_request, remove_friend_request, dispatch])
    return (
        <div className='screen-container friend-page'>

            {userAccount != null ?
                <>
                    <img src={`http://localhost:8000${userAccount.profile_image}`} style={{ maxWidth: "400px", maxHeight: "400px" }} alt="User Picture" />
                    {userAccount.frnd ? <button style={{ width: "300px", height: "50px", borderRadius: "30px", border: "none", margin: "10px", backgroundColor: "blue" }} onClick={unfollow} className='follow'>Following</button> :
                        userAccount.frnd_request ? <button style={{ width: "300px", height: "50px", borderRadius: "30px", border: "none", margin: "10px", backgroundColor: "blue" }} onClick={remove_friend_request} className='follow-request'>Requested</button> :
                            userAccount.frnd_request_sender ? <div>
                                <button style={{ width: "300px", height: "50px", borderRadius: "30px", border: "none", margin: "10px", backgroundColor: "blue" }} onClick={accept_friend_request} className='follow-request'>Accept</button>
                                <button style={{ width: "300px", height: "50px", borderRadius: "30px", border: "none", margin: "10px", backgroundColor: "blue" }} onClick={reject_friend_request} className='follow-request'>Reject</button>
                            </div> :
                                <button style={{ width: "300px", height: "50px", borderRadius: "30px", border: "none", margin: "10px", backgroundColor: "blue" }} onClick={send_friend_request} className='follow-request'>Follow</button>}
                </>
                :
                <img src="#" alt="User Picture" />
            }
        </div>
    )
}

export default FriendPage
