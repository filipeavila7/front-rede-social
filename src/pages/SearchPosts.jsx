import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../service/api";
import "../styles/Post.css";
import SearchBar from "../components/SearchBar";

function SearchPosts() {
    const { termo } = useParams();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [likes, setLikes] = useState({});
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const observerRef = useRef(null);
    const sentinelRef = useRef(null);
    const isFetchingRef = useRef(false);
    const requestedPagesRef = useRef(new Set());

    const hasMoreRef = useRef(hasMore);

    useEffect(() => {
        hasMoreRef.current = hasMore;
    }, [hasMore]);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    async function fetchPosts(pageNumber) {
        if (isFetchingRef.current || !hasMoreRef.current) return;
        if (requestedPagesRef.current.has(pageNumber)) return;

        requestedPagesRef.current.add(pageNumber);
        isFetchingRef.current = true;
        setLoading(true);

        try {
            const res = await api.get(`/posts/search?termo=${termo}&page=${pageNumber}&size=12`);
            const newPosts = res.data.content;
            const isLast = res.data.last;

            const likeStatus = {};
            await Promise.all(
                newPosts.map(async (post) => {
                    try {
                        const resLike = await api.get(`/posts/${post.id}/liked`);
                        likeStatus[post.id] = resLike.data;
                    } catch {
                        likeStatus[post.id] = false;
                    }
                })
            );

            setPosts(prev => pageNumber === 0 ? newPosts : [...prev, ...newPosts]);
            setLikes(prev => ({ ...prev, ...likeStatus }));

            hasMoreRef.current = !isLast;
            setHasMore(!isLast);
        } catch (err) {
            console.error(err);
        } finally {
            isFetchingRef.current = false;
            setLoading(false);
        }
    }

    // Reseta tudo quando o termo de busca mudar
    useEffect(() => {
        setPosts([]);
        setLikes({});
        setPage(0);
        setHasMore(true);
        hasMoreRef.current = true;
        requestedPagesRef.current = new Set();
        isFetchingRef.current = false;
        setIsInitialized(false);
    }, [termo]);

    useEffect(() => {
        if (!isInitialized) {
            fetchPosts(0);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    useEffect(() => {
        if (page > 0) {
            fetchPosts(page);
        }
    }, [page]);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            const first = entries[0];
            if (
                first.isIntersecting &&
                hasMoreRef.current &&
                !isFetchingRef.current
            ) {
                setPage(prev => prev + 1);
            }
        }, { threshold: 0.2 });

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => observerRef.current?.disconnect();
    }, []);

    const renderDots = () => (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '7px',
            padding: '25px'
        }}>
            {[0, 1, 2].map(i => (
                <span
                    key={i}
                    style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: '#999',
                        display: 'inline-block',
                        animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite`
                    }}
                />
            ))}
            <style>{`
                @keyframes bounce {
                    0%,100%{ transform: translateY(0); opacity:0.3; }
                    50%{ transform: translateY(-8px); opacity:1; }
                }
            `}</style>
        </div>
    );

    if (loading && posts.length === 0) {
        return (
            <div className="meus-posts-container">
                <SearchBar />
                {renderDots()}
            </div>
        );
    }

    return (
        <div className="meus-posts-container">
            <SearchBar />

            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                <button onClick={() => navigate(-1)} className="voltar-button">
                    <img src="/voltar.png" alt="" className="voltar-icon" />
                </button>
                <h2>Resultados para: "{termo}"</h2>
            </div>

            {!loading && posts.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: 60 }}>
                    <h2>Nenhum post encontrado</h2>
                    <p>Tente buscar outra palavra-chave</p>
                    <button onClick={() => navigate(-1)} className="voltar-button">
                        <img src="/voltar.png" alt="" className="voltar-icon" />
                        Voltar
                    </button>
                </div>
            ) : (
                <>
                    <div className="post-content">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="card-container"
                                onClick={() => navigate(`/feed/${post.id}`)}
                            >
                                <div className="img-post-container">
                                    <img className="image-post" src={post.imageUrl} alt="" />

                                    <div className="tooltip">
                                        <div className="like-container">
                                            <img
                                                className="tool-img"
                                                src={likes[post.id] ? "/liked.png" : "/like.png"}
                                                alt=""
                                            />
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

                    <div ref={sentinelRef} style={{ height: '10px' }} />

                    {loading && renderDots()}
                </>
            )}
        </div>
    );
}

export default SearchPosts;