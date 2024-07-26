import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUser } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo, getUserMoreInfo } from '../features/auth/authSlice';



function Friends() {
    const [matchedQuery, setMatchedQuery] = useState([])
    const [query, setQuery] = useState(0)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { userInfo, userMoreInfo } = useSelector((state) => state.auth)
    const handleOnKeyUp = (e) => {
        if (e.key == "Enter" && e.target.value != "") {
            setQuery(1)
            dispatch(searchUser({
                "query": e.target.value
            })).unwrap().then((data) => {
                if (data.status == 201) {
                    setMatchedQuery(data.matched_users)
                }
            })
        } else {
            setQuery(0)
            setMatchedQuery([])
        }
    }

    const handleIndividual = (e, user_id) => {
        e.preventDefault()
        navigate(`/friends/${user_id}`)
    }

    useEffect(() => {
        if (userMoreInfo.length == 0) {
            dispatch(getUserInfo()).unwrap()
                .then((data) => {
                    dispatch(getUserMoreInfo({ id: data.id }))
                }).catch((error) => {
                });
        }
    }, [userMoreInfo, userInfo])

    return (
        <div className='screen-container' style={{ display: 'flex', flexDirection: "column", alignItems: 'center' }}>
            <input type="text" style={{ width: "600px", height: "20px" }} name="search" className="search-box" placeholder='search accounts' onKeyUp={handleOnKeyUp} />

            {userMoreInfo.friends == undefined ? "" : userMoreInfo.friends.length > 0 ?
                <>
                    <h4>Your Friend's List</h4>
                    {userMoreInfo.friends != undefined && userMoreInfo.friends.map((frnds, index) => <div onClick={(e) => handleIndividual(e, frnds.id)} key={index + 1 + "req"} style={{ width: "100px", height: "120px", margin: "10px", padding: "10px" }}>
                        <div style={{ width: "70px", height: "70px", backgroundImage: `url(http://localhost:8000${frnds.profile_image})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "50%" }}></div>
                        <div>{frnds.first_name}</div>
                    </div>)}
                </>
                : <h2>You have no friends</h2>}
            {userMoreInfo.frnd_req == undefined ? "" : userMoreInfo.frnd_req.length > 0 ?
                <>
                    <h4>Your Friend's Request</h4>
                    <div style={{ width: "100%", display: "flex", flexWrap: "wrap", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "none", height: "160px", marginTop: "5px" }}>
                        {userMoreInfo.frnd_req != undefined && userMoreInfo.frnd_req.map((frnds, index) => <div onClick={(e) => handleIndividual(e, frnds.id)} key={index + 1 + "req"} style={{ width: "100px", height: "120px", margin: "10px", padding: "10px" }}>
                            <div style={{ width: "70px", height: "70px", backgroundImage: `url(http://localhost:8000${frnds.profile_image})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "50%" }}></div>
                            <div>{frnds.first_name}</div>
                        </div>)}
                    </div>
                </> : <h2>You have no friend's request</h2>}


            {query == 1 ? <>
                <h4>Your Searched Result</h4>
                <div style={{ width: "100%", display: "flex", flexWrap: "wrap", overflowX: "hidden", overflowY: "scroll", scrollbarWidth: "none", height: "190px", marginTop: "5px" }}>
                    {matchedQuery.map((quer, index) => <div key={index + 1 + "fr"} style={{ width: "100px", height: "120px", margin: "10px", padding: "10px" }} onClick={(e) => handleIndividual(e, quer.id)}>
                        <div style={{ width: "70px", height: "70px", backgroundImage: `url(http://localhost:8000/${quer.profile_image})`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: "50%" }}></div>
                        <div>{quer.first_name} {quer.last_name}</div>
                    </div>)}
                </div>
            </> : ""}
        </div>
    )
}

export default Friends
