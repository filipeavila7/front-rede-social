import api from "../service/api"
import { useState, useEffect } from 'react'
import '../styles/Post.css'

function MeusPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [like, setLike] = useState({})
    const [loading, setLoading] = useState(true)

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    async function getPostLiked(postId) {
        try {
            const res = await api.get(`/posts/${postId}/liked`)
            return res.data
        } catch {
            return false
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get('/posts/user/me')
                const posts = res.data
                setMyPosts(posts)

                const likesMap = {}

                for (let post of posts) {
                    const liked = await getPostLiked(post.id)
                    likesMap[post.id] = liked
                }

                setLike(likesMap)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    
    if (loading) {
        return <div>Carregando...</div>
    }

  
    if (myPosts.length === 0) {
        return (
            <div className="empty-posts">
                <img src="/happy.png" alt="Sem posts" className="empty-img" />
                <div className="empty-content">
                    <h1 className="empty-text">Sua galeria ainda está vazia</h1>
                    <p className="empty-text-p">Compartilhe a sua primeira arte com o mundo</p>
                    <p className="empty-text-p">e inspire outras pessoas</p>
                    <button className="btn-mascote">
                        <img className="btn-mascote-icon" src="" alt="" />
                        <p>Criar primeira arte</p>
                    </button>
                </div>
                
            </div>
        )
    }

    return (
        <>
            {myPosts.map((dados) => (
                <div key={dados.id} className='card-container'>
                    <div className="img-post-container">

                        <img className='image-post' src={dados.imageUrl} alt="" />

                        <div className="tooltip">
                            <div className="like-container">
                                <img
                                    className='tool-img'
                                    src={like[dados.id] ? '/liked.png' : '/like.png'}
                                    alt=""
                                />
                                <p className='tool-count'>{dados.likesCount}</p>
                            </div>

                            <div className="comment-container">
                                <img className='tool-img' src="/comment2.png" alt="" />
                                <p className='tool-comment'>{dados.commentsCount}</p>
                            </div>
                        </div>

                        <div className="dia-post">
                            <div className="dia-div">
                                {formatDate(dados.createdAt)}
                            </div>
                            <div className="dots-div">
                                <img src="/dots.png" alt="" className="tool-img" />
                            </div>
                        </div>

                    </div>
                </div>
            ))}
        </>
    )
}

export default MeusPosts