import api from "../service/api"
import { useState, useEffect } from 'react'
import '../styles/Post.css'

function MeusPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [like, setLike] = useState({})


    async function getMyPosts() {
        try {
            const res = await api.get('/posts/user/me')
            console.log(res.data)
            setMyPosts(res.data)
        } catch (error) {
            console.error(error)
        }
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
            const res = await api.get('/posts/user/me')
            setMyPosts(res.data)

            const likesMap = {}

            for (let post of res.data) {
                const liked = await getPostLiked(post.id)
                likesMap[post.id] = liked
            }

            setLike(likesMap)
        }

        fetchData()
    }, [])

    return (<>
        {myPosts.map((dados) => (
            <div key={dados.id} className='card-container'>
                <div className="img-post-container">

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
    </>)
}

export default MeusPosts