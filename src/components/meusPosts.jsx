import api from "../service/api"
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import '../styles/Post.css'

function MeusPosts() {
    const navigate = useNavigate()

    const [myPosts, setMyPosts] = useState([])
    const [like, setLike] = useState({})
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const formatDate = (date) => {
        if (!date) return ""

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    async function getPostLiked(postId) {
        try {
            const res = await api.get(`/posts/${postId}/liked`)
            return res.data
        } catch {
            return false
        }
    }

    async function fetchPosts(currentPage = 0) {
        try {
            if (currentPage === 0) {
                setLoading(true)
            } else {
                setLoadingMore(true)
            }

            const res = await api.get(`/posts/user/me?page=${currentPage}&size=9`)
            const posts = res.data.content

            if (currentPage === 0) {
                setMyPosts(posts)
            } else {
                setMyPosts(prev => [...prev, ...posts])
            }

            setHasMore(!res.data.last)

            const likesMap = {}

            for (let post of posts) {
                const liked = await getPostLiked(post.id)
                likesMap[post.id] = liked
            }

            setLike(prev => ({ ...prev, ...likesMap }))

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        fetchPosts(page)
    }, [page])

    useEffect(() => {
        function handleScroll() {
            if (loadingMore || loading || !hasMore) return

            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 300
            ) {
                setPage(prev => prev + 1)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [loadingMore, loading, hasMore])

    const renderDots = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '7px',
            padding: '40px'
        }}>
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#999',
                        display: 'inline-block',
                        animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`
                    }}
                />
            ))}

            <style>{`
                @keyframes bounce {
                    0%,100%{
                        transform: translateY(0);
                        opacity:0.3;
                    }
                    50%{
                        transform: translateY(-8px);
                        opacity:1;
                    }
                }
            `}</style>
        </div>
    )

    if (loading && myPosts.length === 0) {
        return renderDots()
    }

    if (myPosts.length === 0) {
        return (
            <div className="empty-container">
                <div className="empty-posts">
                    <img src="/happy.png" alt="Sem posts" className="empty-img" />
                    <div className="empty-content">
                        <h1 className="empty-text">Sua galeria ainda está vazia</h1>
                        <p className="empty-text-p">Compartilhe a sua primeira arte com o mundo</p>
                        <p className="empty-text-p">e inspire outras pessoas</p>
                        <button onClick={() => navigate('/posts')} className="btn-mascote">
                            <p>Criar primeira arte</p>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="meus-posts-container">
                <div className="post-content">
                    {myPosts.map((dados) => (
                        <div
                            key={`post-${dados.id}`}
                            className='card-container'
                            onClick={() => navigate(`/feed/${dados.id}?from=my-profile`, {
                                state: {
                                    returnTo: {
                                        kind: "my-profile",
                                        path: "/perfil",
                                        state: null
                                    }
                                }
                            })}
                        >
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

                                    <img className="tool-img" src="/save.png" alt="" />
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
                </div>

                {loadingMore && renderDots()}
            </div>
        </>
    )
}

export default MeusPosts