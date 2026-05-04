import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";


function SearchBar() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function fetchSuggestions() {
            if (!query.trim()) {
                setSuggestions([]);
                return;
            }

            try {
                const res = await api.get(`/posts/search/suggestions?termo=${query}`);
                setSuggestions(res.data);
                setOpen(true);
            } catch (err) {
                console.error(err);
            }
        }

        const delay = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(delay);
    }, [query]);

    function handleSearch(term) {
        navigate(`/feed/search/${encodeURIComponent(term)}`)
        setQuery("");
        setOpen(false);
    }

    return (
        <div className="search-container">

            <input
                type="text"
                placeholder="Pesquisar posts ou tags..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                className="search-input"
            />

            {open && suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((item, i) => (
                        <div
                            key={i}
                            className="suggestion-item"
                            onClick={() => handleSearch(item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;