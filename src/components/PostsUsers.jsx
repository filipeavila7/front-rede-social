import '../styles/Post.css'
import { useState, useEffect } from 'react'
import api from '../service/api'



function PostsUsers(){
    const [posts, setPosts] = useState([])
    
    async function getAllPosts() {
        const res = await api.get('/posts')
        setPosts(res.data)
    }

    useEffect(() => {
        getAllPosts()
      
    }, [])


    




    return(
        <div className='card-container'>
            <div className="img-post-container">
                <img className='image-post' src="/postteste.jpg" alt="" />
            </div>
        </div>
    )
}

export default PostsUsers