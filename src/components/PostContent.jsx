import "../styles/Post.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../service/api";
function PostContent() {
    const { postId } = useParams();
    const [post, setPost] = useState(null)
    
    async function getPost() {
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data || null);
            console.log(res.data)
            
        } catch (error) {
            console.log(error);
        }


    
    }

    useEffect(() => {
          getPost()
        
          
        }, [])
    return (
        <>
            <dir></dir>
        </>
    )
}

export default PostContent