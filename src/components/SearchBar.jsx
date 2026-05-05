import "../styles/SearchUsers.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";

function SearchBar() {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchSuggestions() {
            if (!search.trim()) {
                setResults([]);
                setOpen(false);
                return;
            }

            try {
                const res = await api.get(`/posts/search/suggestions?termo=${search}`);
                setResults(res.data);
                setOpen(true);
            } catch (err) {
                console.error("Erro ao buscar sugestões:", err);
            }
        }

        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [search]);

    function handleSearch(term) {
        navigate(`/feed/search/${encodeURIComponent(term)}`);
        setSearch("");
        setOpen(false);
    }

    return (
        <div className="search-users-container">
            <div className="search-input-box">
                <img className="search-icon" src="/search.png" alt="search" />

                <input
                    type="text"
                    placeholder="Pesquisar posts ou tags..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => {
                        if (search.trim()) setOpen(true);
                    }}
                    className="search-users-input"
                />
            </div>

            {open && (
                <div className="search-dropdown">
                    {results.length > 0 ? (
                        results.map((item, i) => (
                            <div
                                key={i}
                                className="search-user-card"
                                onClick={() => handleSearch(item)}
                            >
                                <div className="search-user-info">
                                    <p className="search-username">{item}</p>
                                    <span className="search-name">
                                        Clique para buscar
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="search-empty">Nenhum resultado encontrado</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;