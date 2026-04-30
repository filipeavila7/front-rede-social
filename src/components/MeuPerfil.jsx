import '../styles/Perfil.css'
import api from '../service/api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function MeuPerfil() {
  const [myProfile, setMyprofile] = useState(null)
  const [myFollowers, setMyFollowers] = useState(null)
  const [myFollows, setMyFollows] = useState(null)
  const [meId, setMeId] = useState(null)
  const [totalPost, setTotalPost] = useState(null)
  const navigate = useNavigate();

  async function getMe() {
    try {
      const res = await api.get("/users/me")
      const id = res.data?.id ?? null
      setMeId(id)
      return id
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async function getMyProfile() {
    try {
      const res = await api.get('/profiles/me')
      setMyprofile(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getMyFollowers(id) {
    try {
      const res = await api.get(`/users/${id}/followers/count`)
      setMyFollowers(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getMyFollows(id) {
    try {
      const res = await api.get(`/users/${id}/following/count`)
      setMyFollows(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }


  async function getTotalPosts(id) {
    const res = await api.get(`/posts/user/${id}/count`)
    setTotalPost(res.data)
  }

  useEffect(() => {
    async function load() {
      const id = await getMe()
      getMyProfile()
      if (id) {
        getMyFollowers(id)
        getTotalPosts(id)
        getMyFollows(id)
      }


    }
    load()
  }, [])

  return (
    <>
      {myProfile && (
        <div className='meu-perfil'>
          {myProfile.messageStatus?.trim() && (
            <div className="message-status-perfil">
              <p>{myProfile.messageStatus}</p>
            </div>
          )}
          <img className='more' src="/add.png" alt="" />
          <div className='img-perfil-container'>
            <img className='img-perfil' src={myProfile.imageUrlProfile ? myProfile.imageUrlProfile : 'null.png'} alt="" />
          </div>
          <div className="dados-perfil">
            <div className='perfil-name'>
              <h4>{myProfile.nome}</h4>
              <p className='userName'>@{myProfile.userName}</p>
            </div>
            

            <div className="seguidores-container">
              <div className="perfil-posts-container">
                <div className="perfil-posts">
                  <img className='profile-icon' src="/blog.png" alt="" />
                  <p>{totalPost ?? 0}</p>
                </div>
                <p className='post-p'>Posts</p>
              </div>

              <div onClick={() => navigate('/perfil/followers')} className='followers-container'>
                <div className='seguidores-content'>
                  <img className='profile-icon' src="/followers.png" alt="" />
                  <p>{myFollowers ?? 0}</p>
                </div>
                <p className='post-p'>Seguidores</p>
              </div>

              <div onClick={() => navigate('/perfil/follows')} className='followers-container'>
                <div className='seguidores-content'>
                  <img className='profile-icon' src="/follow.png" alt="" />
                  <p>{myFollows ?? 0}</p>
                </div>
                <p className='post-p'>Seguindo</p>
              </div>

              <div className="btn-div">
                <button onClick={() => navigate('/perfil/editar')} className='btn-editar-perfil'>
                  <img className='edit-icon' src="/edit.png" alt="" />
                  <p className='btn-texto'>Editar perfil</p>
                </button>
              </div>

            </div>

            <div className='my-bio'><p>{myProfile.bio}</p></div>

          </div>
        </div>
       
      )}
    </>
  )
}

export default MeuPerfil
