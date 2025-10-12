import { useNavigate } from "react-router-dom";
import "../styles/recommend.css";
import { PLACES } from "../data/places.js";

export default function RecommendList() {
  const nav = useNavigate();

  return (
    <main className="rec-page">
      {/* 상단 히어로 */}
      <section className="rec-hero">
        <div className="rec-hero-left">
          <h2 className="rec-hero-title">내가 장소 추천해줄게</h2>
          <p className="rec-hero-sub">해당 장소 이동 기능 추가 (예시)</p>
        </div>
        <div className="rec-hero-right" aria-hidden>아이콘 자리</div>
      </section>

      {/* 추천 카드 3개 */}
      <section className="rec-cards">
        {PLACES.map((p) => (
          <button
            key={p.id}
            className="rec-card"
            type="button"
            onClick={() => nav(`/recommend/${p.id}`)}
            aria-label={`${p.name} 상세로 이동`}
          >
            <div className="rec-card-thumb">아이콘</div>
            <div className="rec-card-label">{p.short}</div>
          </button>
        ))}
      </section>
    </main>
  );
}
