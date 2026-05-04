import '../styles/Perfil.css'
import api from '../service/api'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ConfirmModal from './ConfirmModal'

function OtherPerfil() {
  const [profile, setprofile] = useState(null)
  const [myFollowers, setMyFollowers] = useState(0)
  const [myFollows, setMyFollows] = useState(0)
  const [meId, setMeId] = useState(null)
  const [totalPost, setTotalPost] = useState(0)
  const [seguindo, setSeguindo] = useState(false)
  const [showUnfollowModal, setShowUnfollowModal] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { id, userName } = useParams()
  const backStack = location.state?.backStack ?? []
  const currentProfilePath = `/profile/${id}/${userName}`

  async function seguir(userId) {
    try {
      await api.post(`/users/${userId}/follow`)
      setSeguindo(true)
      setMyFollowers(prev => prev + 1)
    } catch (error) {
      console.log(error)
    }
  }

  async function deixarDeSeguir(userId) {
    try {
      await api.delete(`/users/${userId}/follow`)
      setSeguindo(false)
      setMyFollowers(prev => prev - 1)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleSeguir(userId) {
    if (seguindo) {
      setShowUnfollowModal(true)
    } else {
      await seguir(userId)
    }
  }

 

  async function handleOpenConversation() {
    try {
      const response = await api.post(`/conversations/open/${profile.id}`)
      navigate(`/contatos/${response.data.conversationId}`)
    } catch (error) {
      console.log(error)
    }
  }

  async function confirmUnfollow() {
    await deixarDeSeguir(Number(id))
    setShowUnfollowModal(false)
  }

  useEffect(() => {
    if (id && userName) {
      api.get(`/profiles/user?userName=${userName}`)
        .then((res) => {
          setprofile(res.data)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get(`/users/${id}/followers/count`)
        .then((res) => {
          setMyFollowers(res.data)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get(`/posts/user/${id}/count`)
        .then((res) => {
          setTotalPost(res.data)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get(`/users/${id}/following/count`)
        .then((res) => {
          setMyFollows(res.data)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get("/users/me")
        .then((res) => {
          setMeId(res.data?.id ?? null)
        })
        .catch((error) => {
          console.log(error)
        })

      api.get(`/users/${id}/followingStatus`)
        .then((res) => {
          setSeguindo(res.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [id, userName])

  const isMe = meId === Number(id)

  function handleBack() {
    const previousEntry = backStack[backStack.length - 1]

    if (previousEntry) {
      navigate(previousEntry.path, {
        state: previousEntry.state ?? {
          backStack: backStack.slice(0, -1),
          profilePath: previousEntry.profilePath
        }
      })
      return
    }

    navigate('/feed')
  }

  return (
    <>
      {profile && (
        <>
          <div className='meu-perfil'>
            <button onClick={handleBack} className='voltar-other'>
              <img src="/voltar.png" alt="" className="voltar-other-icon" />
            </button>


            <div className='img-perfil-container'>
              <img
                className='img-perfil'
                src={profile.imageUrlProfile ? profile.imageUrlProfile : '/null.png'}
                alt=""
              />
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
                    <p>{totalPost}</p>
                  </div>
                  <p className='post-p'>Posts</p>
                </div>

                <div
                  onClick={() => navigate(`/profile/${id}/${userName}/followers`, {
                    state: {
                      backStack,
                      profilePath: currentProfilePath
                    }
                  })}
                  className='followers-container'
                >
                  <div className='seguidores-content'>
                    <img className='profile-icon' src="/followers.png" alt="" />
                    <p>{myFollowers}</p>
                  </div>
                  <p className='post-p'>Seguidores</p>
                </div>

                <div
                  onClick={() => navigate(`/profile/${id}/${userName}/follows`, {
                    state: {
                      backStack,
                      profilePath: currentProfilePath
                    }
                  })}
                  className='followers-container'
                >
                  <div className='seguidores-content'>
                    <img className='profile-icon' src="/follow.png" alt="" />
                    <p>{myFollows}</p>
                  </div>
                  <p className='post-p'>Seguindo</p>
                </div>

                <div className="btn-div">
                  <div>
                    <button onClick={handleOpenConversation} className="btn-editar-perfil">
                      <p className="btn-texto">Mensagem</p>
                    </button>
                  </div>
                  <button
                    onClick={
                      isMe
                        ? () => navigate('/perfil/editar')
                        : () => handleSeguir(Number(id))
                    }
                    className='btn-editar-perfil'
                  >
                    <img
                      className='edit-icon'
                      src={
                        isMe
                          ? '/edit.png'
                          : seguindo
                            ? '/seguindo.png'
                            : '/addU.png'
                      }
                      alt=""
                    />

                    <p className='btn-texto'>
                      {isMe
                        ? 'Editar perfil'
                        : seguindo
                          ? 'Seguindo'
                          : 'Seguir'}
                    </p>
                  </button>


                </div>


              </div>

              <div className='my-bio'>
                <p>{profile.bio}</p>
              </div>
            </div>
          </div>

          <ConfirmModal
            isOpen={showUnfollowModal}
            message="Tem certeza que deseja deixar de seguir este usuario?"
            onConfirm={confirmUnfollow}
            onCancel={() => setShowUnfollowModal(false)}
          />
        </>
      )}
    </>
  )
}

export default OtherPerfil
