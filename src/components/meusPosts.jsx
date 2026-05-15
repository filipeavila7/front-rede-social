import api from "../service/api"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Post.css"
import useScrollPosition from "../hooks/useScrollPosition"
import { getMePostsCache, setMePostsCache } from "../store/postsListCache"

function MeusPosts() {
    const navigate = useNavigate()
    const isScrollReady = useScrollPosition("me-posts")

    const cache = getMePostsCache()
    const [myPosts, setMyPosts] = useState(cache.posts)
    const [like, setLike] = useState(cache.likes)
    const [page, setPage] = useState(cache.page)
    const [hasMore, setHasMore] = useState(cache.hasMore)
    const [loading, setLoading] = useState(!cache.initialized)
    const [loadingMore, setLoadingMore] = useState(false)
    const [hasLoadedOnce, setHasLoadedOnce] = useState(cache.initialized)

    const isFetchingRef = useRef(false)
    const hasMoreRef = useRef(hasMore)

    useEffect(() => {
        hasMoreRef.current = hasMore
    }, [hasMore])

    useEffect(() => {
        setMePostsCache({
            posts: myPosts,
            likes: like,
            page,
            hasMore,
            initialized: hasLoadedOnce,
        })
    }, [myPosts, like, page, hasMore, hasLoadedOnce])

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

    async function fetchPosts(pageNumber) {
        if (isFetchingRef.current) return
        if (pageNumber > 0 && !hasMoreRef.current) return

        isFetchingRef.current = true
        if (pageNumber === 0) setLoading(true)
        else setLoadingMore(true)

        try {
            const res = await api.get(`/posts/user/me?page=${pageNumber}&size=9`)
            const posts = res.data.content || []

            const likedResults = await Promise.all(posts.map(post => getPostLiked(post.id)))
            const likesMap = {}
            posts.forEach((post, index) => {
                likesMap[post.id] = likedResults[index]
            })

            if (pageNumber === 0) setMyPosts(posts)
            else setMyPosts(prev => [...prev, ...posts])

            setLike(prev => ({ ...prev, ...likesMap }))
            setHasMore(!res.data.last)
            hasMoreRef.current = !res.data.last
        } catch (error) {
            console.error(error)
        } finally {
            if (pageNumber === 0) {
                setHasLoadedOnce(true)
            }
            isFetchingRef.current = false
            setLoading(false)
            setLoadingMore(false)
        }
    }

    useEffect(() => {
        if (!hasLoadedOnce) {
            fetchPosts(0)
        }
    }, [hasLoadedOnce])

    useEffect(() => {
        if (page > 0) fetchPosts(page)
    }, [page])

    useEffect(() => {
        const handleScroll = () => {
            if (loading || loadingMore || !hasMoreRef.current || isFetchingRef.current) return

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                setPage(prev => prev + 1)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [loading, loadingMore])

    const renderDots = () => (
        <div style={{ display: "flex", justifyContent: "center", gap: "7px", padding: "40px" }}>
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#999",
                        display: "inline-block",
                        animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`
                    }}
                />
            ))}
            <style>{`
                @keyframes bounce {
                    0%,100%{ transform: translateY(0); opacity:0.3; }
                    50%{ transform: translateY(-8px); opacity:1; }
                }
            `}</style>
        </div>
    )

    if (loading && myPosts.length === 0) return renderDots()

    if (myPosts.length === 0) {
        return (
            <div className="empty-container">
                <div className="empty-posts">
                    <img src="/happy.png" alt="Sem posts" className="empty-img" />
                    <div className="empty-content">
                        <h1 className="empty-text">Sua galeria ainda esta vazia</h1>
                        <p className="empty-text-p">Compartilhe a sua primeira arte com o mundo</p>
                        <p className="empty-text-p">e inspire outras pessoas</p>
                        <button onClick={() => navigate("/posts")} className="btn-mascote">
                            <p>Criar primeira arte</p>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={{ visibility: isScrollReady ? "visible" : "hidden", width: "100%" }}>
            <div className="meus-posts-container">
                <div className="post-content">
                    {myPosts.map((dados) => (
                        <div
                            key={`post-${dados.id}`}
                            className="card-container"
                            onClick={() => navigate(`/feed/${dados.id}?from=my-profile`, {
                                state: { returnTo: { kind: "my-profile", path: "/perfil", state: null } }
                            })}
                        >
                            <div className="img-post-container">
                                <img className="image-post" src={dados.imageUrl} alt="" />
                                <div className="tooltip">
                                    <div className="like-container">
                                        <img className="tool-img" src={like[dados.id] ? "/liked.png" : "/like.png"} alt="" />
                                        <p className="tool-count">{dados.likesCount}</p>
                                    </div>
                                    <div className="comment-container">
                                        <img className="tool-img" src="/comment2.png" alt="" />
                                        <p className="tool-comment">{dados.commentsCount}</p>
                                    </div>
                                    <img className="tool-img" src="/save.png" alt="" />
                                </div>
                                <div className="dia-post">
                                    <div className="dia-div">{formatDate(dados.createdAt)}</div>
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
        </div>
    )
}

export default MeusPosts
