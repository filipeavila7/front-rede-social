import "../styles/Post.css";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../service/api";
import { useFeedStore } from "../store/feedStore";

function PostContent() {
    const { postId } = useParams();
    const numericId = Number(postId)

    const [post, setPost] = useState(null)
    const [like, setLike] = useState(false)
    const [comments, setComments] = useState([])
    const [myProfile, setMyprofile] = useState(null)
    const contentComment = useRef()


    const {
        setLikes,
        updatePostLikeCount,
        updatePostCommentCount,
        mergePosts
    } = useFeedStore()

    async function getPost() {
        try {
            const res = await api.get(`/posts/${postId}`);
            console.log(res.data)
            setPost(res.data || null)

            // sincroniza com feed global
            mergePosts([res.data])
        } catch (error) {
            console.log(error);
        }
    }

    async function subComment() {
        const text = contentComment.current.value.trim()
        if (!text) return

        try {
            const res = await api.post(`/posts/${postId}/comments`, {
                content: text
            });

            const newComment = {
                id: res.data?.id || Date.now(),
                content: text,
                createdAt: new Date().toISOString(),
                user: {
                    nome: myProfile?.nome || "Você",
                    profileImageUrl: myProfile?.imageUrlProfile || null
                }
            }

            setComments(prev => [...prev, newComment])

            setPost(prev => ({
                ...prev,
                commentsCount: prev.commentsCount + 1
            }))

            updatePostCommentCount(numericId, +1)

            contentComment.current.value = ""
        } catch (error) {
            console.log(error);
        }
    }

    async function postLike() {
        try {
            await api.post(`/posts/${postId}/likes`);

            setLike(true)
            setLikes(prev => ({ ...prev, [numericId]: true }))

            setPost(prev => ({
                ...prev,
                likesCount: prev.likesCount + 1
            }))

            updatePostLikeCount(numericId, +1)
        } catch (error) {
            console.log(error);
        }
    }

    async function removePostLike() {
        try {
            await api.delete(`/posts/${postId}/likes`);

            setLike(false)
            setLikes(prev => ({ ...prev, [numericId]: false }))

            setPost(prev => ({
                ...prev,
                likesCount: prev.likesCount - 1
            }))

            updatePostLikeCount(numericId, -1)
        } catch (error) {
            console.log(error);
        }
    }

    async function getPostLiked() {
        try {
            const res = await api.get(`/posts/${postId}/liked`);
            setLike(res.data || false)
            setLikes(prev => ({ ...prev, [numericId]: res.data }))
        } catch (error) {
            console.log(error);
        }
    }

    async function getPostCommented() {
        try {
            const res = await api.get(`/posts/${postId}/comments`);
            setComments(res.data || [])
        } catch (error) {
            console.log(error);
        }
    }

    async function getMyProfile() {
        try {
            const res = await api.get('/profiles/me')
            setMyprofile(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    async function handleLike() {
        if (like) {
            await removePostLike();
        } else {
            await postLike();
        }
    }

    useEffect(() => {
        getPost()
        getPostLiked()
        getPostCommented()
        getMyProfile()
    }, [])

    const formatRelativeDate = (date) => {
        if (!date) return "";

        const now = new Date();
        const past = new Date(date);

        const diffMs = now - past;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return "agora";
        if (diffMinutes < 60) return `há ${diffMinutes} min`;
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffDays <= 5) return `há ${diffDays} dia${diffDays > 1 ? "s" : ""}`;

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

                        <button onClick={() => window.history.back()} className="btn-voltar-post">
                            <img src="/voltar.png" alt="" className="back-icon" />
                        </button>
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
                            <p>{post.description}</p>
                            <div className="tags">
                                {post.tags.map(tag => (
                                    <p key={tag.id} className="tag">
                                        #{tag.name}
                                    </p>
                                ))}
                            </div>


                            <div className="post-acoes-container">
                                <button onClick={handleLike} className={like ? "acao-post-btn-liked" : "acao-post-btn"}>
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
                            <p className="comentarios">Comentários ({post.commentsCount})</p>
                        </div>

                        <div className="post-comments-container">
                            {comments.length === 0 ? (
                                <div className="no-comments">
                                    <img className="mascote-null" src="/sad.png" alt="Sem comentários" />
                                    <p className="null">Nenhum comentário ainda</p>
                                </div>
                            ) : (
                                comments.map((dados) => (
                                    <div key={dados.id} className="user-comments">
                                        <div className="user-comment-img-container">
                                            <img
                                                className="user-comment-img"
                                                src={dados.user.profileImageUrl ? dados.user.profileImageUrl : '/null.png'}
                                                alt=""
                                            />
                                        </div>

                                        <div className="user-comment-dados-container">
                                            <div className="horas">
                                                <p className="user-name">{dados.user.nome}</p>
                                                <p className="comment-date">{formatRelativeDate(dados.createdAt)}</p>
                                            </div>
                                            <p className="comment-content">{dados.content}</p>
                                        </div>

                                        <div className="comment-settings">
                                            <img className="dots-comment" src="/dots.png" alt="" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="layout-coment">
                            <div className="comentar-container">
                                <div className="me-img-container">
                                    <img className="me-img" src={myProfile?.imageUrlProfile ? myProfile.imageUrlProfile : '/null.png'} alt="" />
                                </div>

                                <form className="form-comment" action="">
                                    <textarea
                                        placeholder="Adcione um comentário.."
                                        ref={contentComment}
                                        className="form-input"
                                    ></textarea>
                                </form>

                                <button onClick={subComment} className="btn-enviar-comentario">
                                    <img className="enviar-icon" src="/plane.png" alt="" />
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