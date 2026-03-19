import { useState, useRef } from "react";

const IconSearch = ({ size = 24, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isEmpty = query.trim() === "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f4f0; }

        .search-input::placeholder {
          color: #a09090;
          font-family: 'Noto Serif SC', serif;
          font-size: 14px;
          font-weight: 300;
        }
        .search-input:focus {
          outline: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to   { opacity: 1; transform: scale(1); }
        }
        .empty-icon {
          animation: fadeIn 0.4s ease both;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f9f6f2 0%, #f5f0eb 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Top search bar ── */}
        <div
          style={{
            width: "100%",
            borderBottom: "1px solid rgba(180,165,155,0.3)",
            background: "rgba(249,246,242,0.95)",
            backdropFilter: "blur(8px)",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            height: 48,
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <span style={{ color: "#a09090", flexShrink: 0, display: "flex" }}>
            <IconSearch size={16} strokeWidth={2} />
          </span>
          <input
            ref={inputRef}
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索..."
            autoFocus
            style={{
              flex: 1,
              border: "none",
              background: "transparent",
              fontSize: 14,
              color: "#2a2020",
              fontFamily: "'Noto Serif SC', serif",
              fontWeight: 300,
              letterSpacing: "0.02em",
              lineHeight: 1,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "#b0a0a0",
                fontSize: 18,
                lineHeight: 1,
                padding: "0 2px",
                display: "flex",
                alignItems: "center",
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {isEmpty ? (
            /* Empty state: big centered search icon */
            <div
              className="empty-icon"
              style={{ color: "#2a2020", opacity: 0.88 }}
            >
              <IconSearch size={52} strokeWidth={1.6} />
            </div>
          ) : (
            /* Result placeholder — replace with real results */
            <div
              style={{
                color: "#b0a0a0",
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 13,
                letterSpacing: "0.06em",
              }}
            >
              暂无结果
            </div>
          )}
        </div>
      </div>
    </>
  );
}