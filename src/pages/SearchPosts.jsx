import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../service/api";
import "../styles/Post.css";

function SearchPosts() {
    const { termo } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    useEffect(() => {
        async function fetchPosts() {
            try {
                setLoading(true);

                const res = await api.get(
                    `/posts/search?termo=${termo}&page=0&size=12`
                );

                setPosts(res.data.content);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [termo]);

    if (loading) {
        return <div style={{ padding: 30 }}>Carregando...</div>;
    }

    return (
        <div className="meus-posts-container">

            {/* HEADER */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 15,
                marginBottom: 20
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: "8px 12px",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer"
                    }}
                >
                    Voltar
                </button>

                <h2>Resultados para: "{termo}"</h2>
            </div>

            {/* EMPTY STATE */}
            {posts.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    marginTop: 60
                }}>
                    <h2>Nenhum post encontrado</h2>
                    <p>Tente buscar outra palavra-chave</p>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            marginTop: 20,
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer"
                        }}
                    >
                        Voltar
                    </button>
                </div>
            ) : (
                <div className="post-content">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="card-container"
                            onClick={() => navigate(`/feed/${post.id}`)}
                        >
                            <div className="img-post-container">

                                <img
                                    className="image-post"
                                    src={post.imageUrl}
                                    alt=""
                                />

                                <div className="tooltip">
                                    <div className="like-container">
                                        <img className="tool-img" src="/like.png" alt="" />
                                        <p>{post.likesCount}</p>
                                    </div>

                                    <div className="comment-container">
                                        <img className="tool-img" src="/comment2.png" alt="" />
                                        <p>{post.commentsCount}</p>
                                    </div>
                                </div>

                                <div className="dia-post">
                                    {formatDate(post.createdAt)}
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchPosts;