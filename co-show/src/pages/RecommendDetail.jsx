import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/recommend.css";
import { PLACES } from "../data/places.js";

export default function RecommendDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const idx = Math.max(0, PLACES.findIndex((p) => p.id === id));
  const place = PLACES[idx] ?? PLACES[0];

  return (
    <main className="rec-detail-page">
      {/* 상단 큰 패널 */}
      <section className="rec-detail-panel">
        <header className="rec-detail-header">
          <strong>{place.name}</strong>
          <Link to="/recommend" className="rec-close">닫기</Link>
        </header>

        <div className="rec-detail-main">
          <div className="rec-detail-image" aria-label={place.imageLabel}>
            {place.imageLabel}
          </div>
          <aside className="rec-detail-aside">
            <h3>{place.name}</h3>
            <p className="rec-detail-desc">{place.desc}</p>
            <button
              className="rec-go"
              type="button"
              onClick={() => nav(`/map?target=${encodeURIComponent(place.name)}`)}
            >
              이 장소로 이동
            </button>
          </aside>
        </div>
      </section>

      {/* 하단 선택 버튼들 */}
      <section className="rec-bottom-choices">
        {PLACES.map((p) => (
          <Link
            key={p.id}
            to={`/recommend/${p.id}`}
            className={`rec-choice ${p.id === place.id ? "is-active" : ""}`}
            aria-current={p.id === place.id ? "page" : undefined}
          >
            <div className="rec-choice-thumb">{p.id === place.id ? "✔" : "아이콘"}</div>
            <div className="rec-choice-label">{p.short}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
