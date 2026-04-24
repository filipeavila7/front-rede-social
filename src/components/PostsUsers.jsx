import '../styles/Post.css'
import { useState, useEffect } from 'react'
import api from '../service/api'
import { useNavigate } from 'react-router-dom';

let cachedPostsOrder = null;

function PostsUsers() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])
    const [like, setLike] = useState({})


    async function getAllPosts() {
        const res = await api.get('/posts')
        const postsData = [...res.data]
        console.log(res.data)

        if (cachedPostsOrder) {
            const orderMap = new Map(cachedPostsOrder.map((id, index) => [id, index]))

            postsData.sort((a, b) => {
                const aIndex = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER
                const bIndex = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER
                return aIndex - bIndex
            })
        } else {
            postsData.sort(() => Math.random() - 0.5)
            cachedPostsOrder = postsData.map((post) => post.id)
        }

        setPosts(postsData)

    }

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
            const res = await api.get('/posts')
            setPosts(res.data)

            const likesMap = {}

            for (let post of res.data) {
                const liked = await getPostLiked(post.id)
                likesMap[post.id] = liked
            }

            setLike(likesMap)
        }

        fetchData()
    }, [])







    return (
        <>
            {posts.map((dados) => (
                <div onClick={() => navigate(`/feed/${dados.id}`)} key={`post-${dados.id}`} className='card-container'>
                    <div className="img-post-container" >
                        <img className='image-post' src={dados.imageUrl} alt="" />
                        <div className="tooltip">
                            <div className="like-container">
                                <img className='tool-img' src={like[dados.id] ? '/liked.png' : '/like.png'} alt="" />
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

        </>
    )
}

export default PostsUsers
