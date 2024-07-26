import { useEffect, useState } from "react"
import "../styles/Library.css"
import { MdOutlinePlaylistAdd } from "react-icons/md";
import { IconContext } from "react-icons";
import { IoMdPlay, IoMdPause } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setCurrSong, reset } from "../features/player/playerSlice";

function Library({ handlePlay, setSongDuration }) {
  const [query, setQuery] = useState("")


  const { allSongs } = useSelector((state) => state.songs)
  const { isPlaying, currSong } = useSelector((state) => state.player)

  const dispatch = useDispatch()

  const handleOnClick = (song) => {
    dispatch(reset())
    dispatch(setCurrSong(song))
    setSongDuration(0)
  }

  const handleOnKeyUp = (e) => {
    if (e.key == "Enter") {
      setQuery(e.target.value);
    }
  }

  const isPlayable = (song1, song2) => {
    if (song1 == null || song2 == null) {
      return true
    } else if (song1.id === song2.id) {
      return false
    } else {
      return true
    }
  }

  useEffect(() => {

  }, [query, dispatch])


  return (
    <div className="screen-container library">
      <input type="text" name="search" className="search-box" onKeyUp={handleOnKeyUp} />
      <div className="songs-cards">
        {allSongs.map((song, index) => {
          return (<div key={index + 1} className="song-card">
            <div className="song-title">{song.song_title}</div>
            <div className="song-artist">
              by{' '}
              {song.song_artist.map((artist, inde) => (
                <Link key={'ar' + inde} to={"/dashboard"} className="artist-link">
                  {artist.name} {song.song_artist.length > inde+1 ? ", ":''}
                </Link>
              ))}
            </div>
            <div className="action-buttons">
              <IconContext.Provider value={{ size: "30px", className: "library-icon" }}>
                <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  <MdOutlinePlaylistAdd style={{ color: "black" }} />
                </button>
              </IconContext.Provider>
              <IconContext.Provider value={{ size: "30px", className: "library-icon" }}>
                <button style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                  {isPlayable(currSong, song) ? <IoMdPlay style={{ color: "black" }} onClick={() => handleOnClick(song)} /> : !isPlaying ? <IoMdPlay style={{ color: "black" }} onClick={handlePlay} /> : <IoMdPause style={{ color: "black" }} onClick={handlePlay} />}
                </button>
              </IconContext.Provider>
            </div>
          </div>)
        })
        }
        <div >
        </div>
      </div>
    </div>
  )
}

export default Library
