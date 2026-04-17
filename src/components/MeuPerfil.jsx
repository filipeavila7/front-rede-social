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
          <img className='more' src="/plus.png" alt="" />
          <div className='img-perfil-container'>
            <img className='img-perfil' src={myProfile.imageUrlProfile} alt="" />
          </div>
          <div className="dados-perfil">
            <p>{myProfile.nome}</p>

            <div className="seguidores-container">
              <p>Posts: {totalPost ?? 0}</p>
              <p className='seguidores'>Seguidores: {myFollowers ?? 0}</p>
              <p className='seguindo'>Seguindo: {myFollows ?? 0}</p>
              <button onClick={()=> navigate('/perfil/editar')} className='btn-editar-perfil'>Editar Perfil</button>
            </div>

            <div className='my-bio'><p>{myProfile.bio}</p></div>

          </div>
        </div>
      )}
    </>
  )
}

export default MeuPerfil
