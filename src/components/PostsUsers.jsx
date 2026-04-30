import '../styles/Post.css'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../service/api'
import { useFeedStore } from '../store/feedStore'
import useScrollPosition from '../hooks/useScrollPosition'

function PostsUsers() {
    const navigate = useNavigate()
    const isScrollReady = useScrollPosition("feed")

    const {
        posts,
        likes,
        setLikes,
        page,
        setPage,
        hasMore,
        setHasMore,
        seed,
        setSeed,
        isInitialized,
        setInitialized,
        loading,
        setLoading,
        mergePosts
    } = useFeedStore()

    const observerRef = useRef(null)
    const sentinelRef = useRef(null)
    const isFetchingRef = useRef(false)
    const requestedPagesRef = useRef(new Set())

    const hasMoreRef = useRef(hasMore)
    const seedRef = useRef(seed)

    hasMoreRef.current = hasMore
    seedRef.current = seed

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
        if (isFetchingRef.current || !hasMoreRef.current) return
        if (requestedPagesRef.current.has(pageNumber)) return

        requestedPagesRef.current.add(pageNumber)
        isFetchingRef.current = true
        setLoading(true)

        try {
            const params = { page: pageNumber, size: 12 }
            if (seedRef.current !== null) params.seed = seedRef.current

            const res = await api.get('/posts', { params })

            const returnedSeed = res.headers['x-feed-seed']
            if (returnedSeed && seedRef.current === null) {
                setSeed(returnedSeed)
                seedRef.current = returnedSeed
            }

            const newPosts = res.data.content
            const isLast = res.data.last

            const likedResults = await Promise.all(
                newPosts.map(post => getPostLiked(post.id))
            )

            const likesMap = {}
            newPosts.forEach((post, index) => {
                likesMap[post.id] = likedResults[index]
            })

            mergePosts(newPosts)
            setLikes(prev => ({ ...prev, ...likesMap }))

            hasMoreRef.current = !isLast
            setHasMore(!isLast)
        } catch (err) {
            console.log(err)
        } finally {
            isFetchingRef.current = false
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isInitialized) {
            fetchPosts(0)
            setInitialized(true)
        }
    }, [])

    useEffect(() => {
        if (page > 0) {
            fetchPosts(page)
        }
    }, [page])

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            const first = entries[0]

            if (
                first.isIntersecting &&
                hasMoreRef.current &&
                !isFetchingRef.current
            ) {
                setPage(prev => prev + 1)
            }
        }, { threshold: 0.2 })

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current)
        }

        return () => observerRef.current?.disconnect()
    }, [])

    return (
        <div style={{ display: 'contents', visibility: isScrollReady ? 'visible' : 'hidden' }}>
            {posts.map((dados) => (
                <div
                    onClick={() => navigate(`/feed/${dados.id}`)}
                    key={`post-${dados.id}`}
                    className='card-container'
                >
                    <div className="img-post-container">
                        <img className='image-post' src={dados.imageUrl} alt="" />

                        <div className="tooltip">
                            <div className="like-container">
                                <img
                                    className='tool-img'
                                    src={likes[dados.id] ? '/liked.png' : '/like.png'}
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
                            <div className="dia-div">{formatDate(dados.createdAt)}</div>
                            <div className="dots-div">
                                <img src="/dots.png" alt="" className="tool-img" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <div ref={sentinelRef} style={{ height: '10px' }} />

            {loading && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '7px',
                    padding: '25px'
                }}>
                    {[0, 1, 2].map(i => (
                        <span
                            key={i}
                            style={{
                                width: '9px',
                                height: '9px',
                                borderRadius: '50%',
                                background: '#999',
                                display: 'inline-block',
                                animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`
                            }}
                        />
                    ))}
                </div>
            )}

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
}

export default PostsUsers
