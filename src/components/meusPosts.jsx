import api from "../service/api"
import { useState, useEffect } from 'react'
import '../styles/Post.css'

function MeusPosts() {
    const [myPosts, setMyPosts] = useState([])
    const [hoveredId, setHoveredId] = useState(null);
    
    async function getMyPosts() {
        try {
            const res = await api.get('/posts/user/me')
            console.log(res.data)
            setMyPosts(res.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getMyPosts()

    }, [])

    return <>
        {myPosts.map((dados) => (
            <div key={dados.id} className='card-container'>
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
}

export default MeusPosts