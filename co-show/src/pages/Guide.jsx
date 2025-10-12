import { useNavigate } from "react-router-dom";
import "../styles/guide.css";

export default function Guide() {
  const nav = useNavigate();
  const features = [
    { title: "전체 지도 보기", desc: "전시장을 한눈에 확인해요", to: "/map" },
    { title: "빠른 부스 검색", desc: "찾고 싶은 부스를 바로 찾아요", to: "/search" },
    { title: "추천 장소",     desc: "핫스팟 부스 정보를 알아봐요", to: "/recommend" },
  ];

  return (
    <main className="guide-page">
      <section className="hero-row">
        <div className="bubble">어디로 데려다줄까?</div>
      </section>

      <section className="cards">
        {features.map((f) => (
          <button key={f.title} className="card" onClick={() => nav(f.to)}>
            <div className="icon-box">아이콘</div>
            <h3 className="card-title">{f.title}</h3>
            <p className="card-desc">{f.desc}</p>
          </button>
        ))}
      </section>
    </main>
  );
}
