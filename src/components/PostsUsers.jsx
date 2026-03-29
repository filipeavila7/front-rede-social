import '../styles/Post.css'
import { useState, useEffect } from 'react'
import api from '../service/api'



function PostsUsers() {
    const [posts, setPosts] = useState([])
    const [hoveredId, setHoveredId] = useState(null);

    async function getAllPosts() {
        const res = await api.get('/posts')
        const shuffled = res.data.sort(() => Math.random() - 0.5)
        setPosts(shuffled)
        console.log(res.data)

    }

    useEffect(() => {
        getAllPosts()

    }, [])







    return (
        <>
            {posts.map((dados) => (
                <div key={`post-${dados.id}`} className='card-container'>
                    <div className="img-post-container" onMouseEnter={() => setHoveredId(dados.id)}
                        onMouseLeave={() => setHoveredId(null)}>
                        <img className='image-post' src={dados.imageUrl} alt="" />
                        {hoveredId === dados.id && (
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
                        )}
                    </div>
                </div>
            ))}

        </>
    )
}

export default PostsUsers