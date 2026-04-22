import "../styles/Post.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../service/api";
function PostContent() {
    const { postId } = useParams();
    const [post, setPost] = useState(null)
    const [like, setLike] = useState(false)

    async function getPost() {
        try {
            const res = await api.get(`/posts/${postId}`);
            setPost(res.data || null);
            console.log(res.data)

        } catch (error) {
            console.log(error);
        }



    }

    async function getPostLiked() {
        try {
            const res = await api.get(`/posts/${postId}/liked`);
            setLike(res.data || null);
            console.log(res.data)

        } catch (error) {
            console.log(error);
        }



    }

    useEffect(() => {
        getPost()
        getPostLiked()


    }, [])

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };
    return (
        <>
            {post && (
                <div className="post-inner-layout">
                    <div className="post-inner-img-container">
                        <img className="post-inner-img" src={post.imageUrl} alt="" />
                    </div>
                    <div className="post-inner-content">
                        <div className="dono-post">
                            <div className="dono-post-img-container">
                                <img src={post.user.profileImageUrl} alt="" className="dono-post-img" />
                            </div>

                            <div className="dono-dados">
                                <p className="dono-nome">{post.user.nome}</p>
                                <p className="post-data">Publicado em: {formatDate(post.createdAt)}</p>
                            </div>

                            <div className="seguir-dono">
                                <button className="btn-dono-seguir">Seguir</button>
                            </div>

                        </div>
                        <div className="dados-post">
                            <p className="dados-post-nome">{post.content}</p>
                            
                            <div className="post-acoes-container">
                                <button className={like ? "acao-post-btn-liked" : "acao-post-btn"}>
                                    <img src={like ? '/liked.png' : '/like.png'} alt="" className="img-acao" />
                                    <p className={like ? "liked" : "not-liked"}>{ post.likesCount}</p>
                                </button>
                                <button className="acao-post-btn">
                                    <img src="/comment3.png" alt="" className="img-acao" />
                                    <p>{post.commentsCount}</p>
                                </button>
                                <button className="acao-post-btn">
                                    <img src="/share.png" alt="" className="img-acao" />
                                    <p>0</p>
                                </button>
                                <button className="salvar-btn">
                                    <img className="salve-img" src="/save.png" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}

        </>
    )
}

export default PostContent