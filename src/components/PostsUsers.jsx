import '../styles/Post.css'
import { useState, useEffect } from 'react'
import api from '../service/api'
import { useNavigate } from 'react-router-dom';

let cachedPostsOrder = null;

function PostsUsers() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])


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

    useEffect(() => {
        getAllPosts()

    }, [])







    return (
        <>
            {posts.map((dados) => (
                <div onClick={() => navigate(`/feed/${dados.id}`)} key={`post-${dados.id}`} className='card-container'>
                    <div className="img-post-container" >
                        <img className='image-post' src={dados.imageUrl} alt="" />
                        <div className="tooltip">
                            <div className="like-container">
                                <img className='tool-img' src="/like.png" alt="" />
                                <p className='tool-count'>{dados.likesCount}</p>
                            </div>
                            <div className="comment-container">
                                <img className='tool-img' src="/comment3.png" alt="" />
                                <p className='tool-comment'>{dados.commentsCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </>
    )
}

export default PostsUsers
