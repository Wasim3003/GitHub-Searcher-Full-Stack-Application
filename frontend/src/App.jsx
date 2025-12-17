import { useState } from "react";
import { searchGithub } from "./api";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState("users");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Controls animation only
  const isCentered = query.trim() === "";

  const handleInputChange = async (value) => {
    setQuery(value);

    if (value.length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    const res = await searchGithub(entity, value);
    setResults(res.data.data.items);
    setLoading(false);
  };

  return (
    <div className="page">
      {/* SEARCH CONTAINER */}
      <div className={`search-container ${isCentered ? "center" : "top"}`}>
        {/* HEADER */}
        <div className="header-row">
          <svg className="github-icon" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
          </svg>

          <div className="header-text">
            <div className="title">GitHub Searcher</div>
            <div className="subtitle">
              Search users or repositories below
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-row">
          <input
            placeholder="Start typing to search .."
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          <select
            value={entity}
            onChange={(e) => {
              setEntity(e.target.value);
              if (query.length >= 3) handleInputChange(query);
            }}
          >
            <option value="users">Users</option>
            <option value="repositories">Repositories</option>
          </select>
        </div>
      </div>

      {/* SPACER – prevents layout jump */}
      <div className={`search-spacer ${isCentered ? "center" : "top"}`} />

      {/* RESULTS GRID */}
      <div className="grid">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}

        {!loading &&
          results.map((item) => (
            <div
              key={item.id}
              className="card"
              onMouseDown={(e) => e.preventDefault()} // 🔧 focus bug fix
              onClick={() => window.open(item.html_url, "_blank")}
            >
              <img
                src={item.avatar_url || item.owner?.avatar_url}
                alt=""
              />
              <div className="card-title">
                {item.login || item.full_name}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;
