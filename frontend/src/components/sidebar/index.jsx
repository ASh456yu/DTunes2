import "./sidebar.css"
import SidebarButton from "./SidebarButton"
import "./sidebarButton.css"
import { FaGripfire, FaPlay } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa"
import { IoLibrary } from "react-icons/io5";
import { PiPlaylistFill } from "react-icons/pi"
import { useSelector } from 'react-redux'
import { getUserInfo } from '../../features/auth/authSlice'
import { useDispatch } from 'react-redux'
import { getUserMoreInfo } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";


function Sidebar() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { userInfo, userMoreInfo } = useSelector((state) => state.auth)
    if (userInfo.first_name == undefined) {
        dispatch(getUserInfo()).unwrap().then((data) => {
            dispatch(getUserMoreInfo({
                id: data.id
            }))
        })

    }
    const handleProfile = () => {
        navigate("/profile")
    }

    return (
        <div className="sidebar-container">
            <div className="profile" style={{ backgroundImage: `url(http://localhost:8000/${userMoreInfo.profile_image})` }} onClick={handleProfile}>

            </div>

            <div>
                <SidebarButton title="Library" to="/" icon={<IoLibrary />}></SidebarButton>
                {/* <SidebarButton title="Trending" to="/trending" icon={<FaGripfire />}></SidebarButton> */}
                <SidebarButton title="Playlist" to="/playlist" icon={<PiPlaylistFill />}></SidebarButton>
                <SidebarButton title="Friends" to="/friends" icon={<FaUserFriends />}></SidebarButton>
                {/* <SidebarButton title="Player" to="/player" icon={<FaPlay />}></SidebarButton> */}
            </div>
            <SidebarButton title="Sign Out" to="/logout" icon={<FaSignOutAlt />}></SidebarButton>
        </div>
    )
}

export default Sidebar
