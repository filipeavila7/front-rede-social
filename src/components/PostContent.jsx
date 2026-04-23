import "../styles/Post.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../service/api";
function PostContent() {
    const { postId } = useParams();
    const [post, setPost] = useState(null)
    const [like, setLike] = useState(false)
    const [comments, setComments] = useState([])
    const [myProfile, setMyprofile] = useState(null)

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


    async function getPostCommented() {
        try {
            const res = await api.get(`/posts/${postId}/comments`);
            setComments(res.data || null);
            console.log(res.data)

        } catch (error) {
            console.log(error);
        }

    }

    async function getMyProfile() {
        try {
            const res = await api.get('/profiles/me')
            setMyprofile(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getPost()
        getPostLiked()
        getPostCommented()
        getMyProfile()


    }, [])

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const formatRelativeDate = (date) => {
        if (!date) return "";

        const now = new Date();
        const past = new Date(date);

        const diffMs = now - past; // diferença em milissegundos

        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "agora";
        if (diffMinutes < 60) return `há ${diffMinutes} min`;
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffDays <= 5) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;

        // depois de 5 dias → data normal
        return past.toLocaleDateString("pt-BR", {
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
                                <p className="post-data">Publicado {formatRelativeDate(post.createdAt)}</p>
                            </div>

                            <div className="seguir-dono">
                                <button className="btn-dono-seguir">Seguir</button>
                                <button className="dots-button">
                                    <img className="dots-img" src="/dots.png" alt="" />
                                </button>
                            </div>

                        </div>
                        <div className="dados-post">
                            <p className="dados-post-nome">{post.content}</p>

                            <div className="post-acoes-container">
                                <button className={like ? "acao-post-btn-liked" : "acao-post-btn"}>
                                    <img src={like ? '/liked.png' : '/like.png'} alt="" className="img-acao" />
                                    <p className={like ? "liked" : "not-liked"}>{post.likesCount}</p>
                                </button>
                                <button className="acao-post-btn">
                                    <img src="/comment2.png" alt="" className="img-acao" />
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
                        <div className="count">
                            <p className="comentarios">
                                Comentários ({post.commentsCount})
                            </p>
                        </div>
                        <div className="post-comments-container">

                            {comments.map((dados) => (
                                <div key={dados.id} className="user-comments">
                                    <div className="user-comment-img-container">
                                        <img className="user-comment-img" src={dados.user.profileImageUrl} alt="" />
                                    </div>
                                    <div className="user-comment-dados-container">
                                        <div className="horas">
                                            <p className="user-name">{dados.user.nome}</p>
                                            <p className="comment-date">
                                                {formatRelativeDate(dados.createdAt)}
                                            </p>
                                        </div>
                                        <p className="comment-content">{dados.content}</p>
                                    </div>
                                    <div className="comment-settings">
                                        <img className="dots-comment" src="/dots.png" alt="" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="comentar-container">
                            <div className="me-img-container">
                                <img className="me-img" src={myProfile.
                                    imageUrlProfile} alt="" />
                            </div>
                            <form className="form-comment" action="">
                                <textarea placeholder="Adcione um comentário.."  className="form-input" name="" id=""></textarea>
                            </form>
                            <button className="btn-enviar-comentario">
                                <img className="enviar-icon" src="/plane.png" alt="" />
                            </button>
                        </div>

                    </div>
                </div>

            )}

        </>
    )
}

export default PostContent