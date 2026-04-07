import '../styles/Perfil.css'
import api from '../service/api'
import { useState, useEffect } from 'react'

function MeuPerfil() {
  const [myProfile, setMyprofile] = useState(null)
  const [myFollowers, setMyFollowers] = useState(null)
  const [myFollows, setMyFollows] = useState(null)
  const [meId, setMeId] = useState(null)
  const [totalPost, setTotalPost] = useState(null)

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

  async function getMyFollows() {
    try {
      const res = await api.get('/users/me/following')
      setMyFollows(res.data)
    } catch (error) {
      console.log(error)
    }
  }


  async function getTotalPosts() {
    const res = await api.get(`/posts/user/${userId}/count`)
    setTotalPost(res.data)
  }

  useEffect(() => {
    async function load() {
      const id = await getMe()
      getMyProfile()
      if (id) getMyFollowers(id)
      getMyFollows()
      getTotalPosts()
    }
    load()
  }, [])

  return (
    <>
      {myProfile && (
        <div className='meu-perfil'>
          <div className='img-perfil-container'>
            <img className='img-perfil' src={myProfile.imageUrlProfile} alt="" />
          </div>
          <div className="dados-perfil">
            <p>{myProfile.nome}</p>

            <div className="seguidores-container">
              <p>Posts: {totalPost ?? 0}</p>
              <p className='seguidores'>Seguidores: {myFollowers ?? 0}</p>
              <p className='seguindo'>Seguindo: {myFollows ? myFollows.length : 0}</p>
              <button className='btn-editar-perfil'>Editar Perfil</button>
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}

export default MeuPerfil
