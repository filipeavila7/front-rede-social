import "../styles/Post.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../service/api";
import { useFeedStore } from "../store/feedStore";
import ConfirmModal from "./ConfirmModal";

function PostContent() {
    const { postId } = useParams();
    const numericId = Number(postId);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const from = searchParams.get("from");
    const returnTo = location.state?.returnTo ?? { kind: "feed", path: "/feed", state: null };

    const [post, setPost] = useState(null);
    const [like, setLike] = useState(false);
    const [comments, setComments] = useState([]);
    const [myProfile, setMyprofile] = useState(null);
    const [meId, setMeId] = useState(null);
    const [seguindo, setseguindo] = useState(false);
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);

    const contentComment = useRef();

    const {
        setLikes,
        updatePostLikeCount,
        updatePostCommentCount,
        mergePosts
    } = useFeedStore();

    async function getIsSeguindo(userId) {
        try {
            const res = await api.get(`/users/${userId}/followingStatus`);
            setseguindo(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function seguir(userId) {
        try {
            await api.post(`/users/${userId}/follow`);
            setseguindo(true);
        } catch (error) {
            console.log(error);
        }
    }

    async function deixarDeSeguir(userId) {
        try {
            await api.delete(`/users/${userId}/follow`);
            setseguindo(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSeguir(userId) {
        if (seguindo) {
            setShowUnfollowModal(true);
        } else {
            await seguir(userId);
        }
    }

    async function confirmUnfollow() {
        if (!post?.user?.id) return;

        await deixarDeSeguir(post.user.id);
        setShowUnfollowModal(false);
    }

    async function subComment() {
        const text = contentComment.current.value.trim();
        if (!text) return;

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
            };

            setComments(prev => [...prev, newComment]);

            setPost(prev => ({
                ...prev,
                commentsCount: prev.commentsCount + 1
            }));

            updatePostCommentCount(numericId, +1);

            contentComment.current.value = "";
        } catch (error) {
            console.log(error);
        }
    }

    async function postLike() {
        try {
            await api.post(`/posts/${postId}/likes`);

            setLike(true);
            setLikes(prev => ({ ...prev, [numericId]: true }));

            setPost(prev => ({
                ...prev,
                likesCount: prev.likesCount + 1
            }));

            updatePostLikeCount(numericId, +1);
        } catch (error) {
            console.log(error);
        }
    }

    async function removePostLike() {
        try {
            await api.delete(`/posts/${postId}/likes`);

            setLike(false);
            setLikes(prev => ({ ...prev, [numericId]: false }));

            setPost(prev => ({
                ...prev,
                likesCount: prev.likesCount - 1
            }));

            updatePostLikeCount(numericId, -1);
        } catch (error) {
            console.log(error);
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
        api.get(`/posts/${postId}`)
            .then((res) => {
                setPost(res.data || null);
                mergePosts([res.data]);

                if (res.data?.user?.id) {
                    getIsSeguindo(res.data.user.id);
                }
            })
            .catch((error) => {
                console.log(error);
            });

        api.get(`/posts/${postId}/liked`)
            .then((res) => {
                setLike(res.data || false);
                setLikes(prev => ({ ...prev, [numericId]: res.data }));
            })
            .catch((error) => {
                console.log(error);
            });

        api.get(`/posts/${postId}/comments`)
            .then((res) => {
                setComments(res.data || []);
            })
            .catch((error) => {
                console.log(error);
            });

        api.get("/profiles/me")
            .then((res) => {
                setMyprofile(res.data);
            })
            .catch((error) => {
                console.log(error);
            });

        api.get("/users/me")
            .then((res) => {
                setMeId(res.data?.id ?? null);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [postId, numericId, mergePosts, setLikes]);

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

    const isMe = meId === post?.user?.id;

    function handleBack() {
        if (from === "my-profile" || returnTo.kind === "my-profile") {
            navigate("/perfil");
            return;
        }

        navigate(returnTo.path ?? "/feed", {
            state: returnTo.state ?? undefined
        });
    }

    function handleOwnerProfileClick() {
        const profileState = {
            backStack: [
                {
                    path: `${location.pathname}${location.search}`,
                    state: {
                        returnTo
                    }
                }
            ]
        };

        navigate(`/profile/${post.user.id}/${post.user.userName}`, {
            state: profileState
        });
    }

    return (
        <>
            {post && (
                <div className="post-inner-layout">
                    <div className="post-inner-img-container">
                        <img className="post-inner-img" src={post.imageUrl} alt="" />

                        <button onClick={handleBack} className="btn-voltar-post">
                            <img src="/voltar.png" alt="" className="back-icon" />
                        </button>
                    </div>

                    <div className="post-inner-content">
                        <div className="dono-post">
                            <div
                                className="dono-post-img-container"
                                onClick={handleOwnerProfileClick}
                            >
                                <img src={post.user.profileImageUrl} alt="" className="dono-post-img" />
                            </div>

                            <div className="dono-dados">
                                <p className="dono-nome">{post.user.nome}</p>
                                <p className="post-data">@{post.user.userName}</p>
                                <p className="post-data">Publicado em {formatRelativeDate(post.createdAt)}</p>
                            </div>

                            <div className="seguir-dono">
                                <button
                                    onClick={() =>
                                        isMe
                                            ? navigate("/perfil/editar")
                                            : handleSeguir(post.user.id)
                                    }
                                    className="btn-dono-seguir"
                                >
                                    {isMe ? "Editar Perfil" : seguindo ? "Seguindo" : "Seguir"}
                                </button>

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
                                    <p key={tag.id} className="tag">#{tag.name}</p>
                                ))}
                            </div>

                            <div className="post-acoes-container">
                                <button onClick={handleLike} className={like ? "acao-post-btn-liked" : "acao-post-btn"}>
                                    <img src={like ? "/liked.png" : "/like.png"} alt="" className="img-acao" />
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
                                                src={dados.user.profileImageUrl ? dados.user.profileImageUrl : "/null.png"}
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
                                    <img
                                        className="me-img"
                                        src={myProfile?.imageUrlProfile ? myProfile.imageUrlProfile : "/null.png"}
                                        alt=""
                                    />
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

            <ConfirmModal
                isOpen={showUnfollowModal}
                message="Tem certeza que deseja deixar de seguir este usuario?"
                onConfirm={confirmUnfollow}
                onCancel={() => setShowUnfollowModal(false)}
            />
        </>
    );
}

export default PostContent;
