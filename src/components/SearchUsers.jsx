import "../styles/SearchUsers.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

function SearchUsers() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    async function fetchUsers() {
        if (!search.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        try {
            const res = await api.get(`/profiles/search?q=${search}`);
            setResults(res.data);
            setOpen(true);
        } catch (error) {
            console.log("Erro ao buscar usuários:", error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    function handleNavigate(userId, userName) {
        navigate(`/profile/${userId}/${userName}`);
        setSearch("");
        setOpen(false);
    }

    return (
        <div className="search-users-container">
            <div className="search-input-box">
                <img className="search-icon" src="/search.png" alt="" />
                <input
                    type="text"
                    placeholder="Pesquisar usuários..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-users-input"
                />
            </div>

            {open && (
                <div className="search-dropdown">
                    {results.length > 0 ? (
                        results.map((user) => (
                            <div
                                key={user.id}
                                className="search-user-card"
                                onClick={() => handleNavigate(user.id, user.userName)}
                            >
                                <img
                                    src={user.imageUrlProfile || "/null.png"}
                                    alt=""
                                    className="search-user-photo"
                                />

                                <div className="search-user-info">
                                    <p className="search-username">@{user.userName}</p>
                                    <span className="search-name">{user.nome}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="search-empty">Nenhum usuário encontrado</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchUsers;