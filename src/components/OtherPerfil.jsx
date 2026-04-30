import '../styles/Perfil.css'
import api from '../service/api'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'


function OtherPerfil() {
  const [profile, setprofile] = useState(null)
  const [myFollowers, setMyFollowers] = useState(null)
  const [myFollows, setMyFollows] = useState(null)
  const [meId, setMeId] = useState(null)
  const [totalPost, setTotalPost] = useState(null)
  const navigate = useNavigate();

  const { id, userName } = useParams()




  async function getProfile() {
    try {
      const res = await api.get(`/profiles/user?userName=${userName}`)
      setprofile(res.data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getFollowers(id) {
    try {
      const res = await api.get(`/users/${id}/followers/count`)
      setMyFollowers(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function getFollows(id) {
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
    if (id && userName) {
      getProfile()
      getFollowers(id)
      getTotalPosts(id)
      getFollows(id)
    }
  }

  load()
}, [id, userName])

  return (
    <>
      {profile && (
        <div className='meu-perfil'>
          {profile.messageStatus?.trim() && (
            <div className="message-status-perfil">
              <p>{profile.messageStatus}</p>
            </div>
          )}
          <div className='img-perfil-container'>
            <img className='img-perfil' src={profile.imageUrlProfile ? profile.imageUrlProfile : 'null.png'} alt="" />
          </div>
          <div className="dados-perfil">
            <div className='perfil-name'>
              <h4>{profile.nome}</h4>
              <p className='userName'>@{profile.userName}</p>
            </div>
            

            <div className="seguidores-container">
              <div className="perfil-posts-container">
                <div className="perfil-posts">
                  <img className='profile-icon' src="/blog.png" alt="" />
                  <p>{totalPost ?? 0}</p>
                </div>
                <p className='post-p'>Posts</p>
              </div>

              <div onClick={() => navigate(`/perfil/${id}/followers`)} className='followers-container'>
                <div className='seguidores-content'>
                  <img className='profile-icon' src="/followers.png" alt="" />
                  <p>{myFollowers ?? 0}</p>
                </div>
                <p className='post-p'>Seguidores</p>
              </div>

              <div onClick={() => navigate(`/perfil/${id}/follows`)} className='followers-container'>
                <div className='seguidores-content'>
                  <img className='profile-icon' src="/follow.png" alt="" />
                  <p>{myFollows ?? 0}</p>
                </div>
                <p className='post-p'>Seguidores</p>
              </div>

              <div className="btn-div">
                <button onClick={() => navigate('/perfil/editar')} className='btn-editar-perfil'>
                  <p className='btn-texto'>Seguir</p>
                </button>
              </div>

            </div>

            <div className='my-bio'><p>{profile.bio}</p></div>

          </div>
        </div>
       
      )}
    </>
  )
}

export default OtherPerfil
