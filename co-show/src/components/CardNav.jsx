import { useNavigate } from "react-router-dom";
import styles from "./CardNav.module.css";

const cards = [
  { title: "전시장 안내", to: "/guide",   color: "var(--card-yellow)",  dark: "var(--card-yellow-dark)" },
  { title: "전시 일정",   to: "/schedule", color: "var(--card-blue)",    dark: "var(--card-blue-dark)" },
  { title: "이벤트 참여", to: "/events",   color: "var(--card-green)",   dark: "var(--card-green-dark)" },
  { title: "사진 촬영",   to: "/photo",    color: "var(--card-red)",     dark: "var(--card-red-dark)" },
  { title: "문의",       to: "/inquiry",  color: "var(--card-purple)",  dark: "var(--card-purple-dark)" },
];

export default function CardNav(){
  const nav = useNavigate();

  return (
    <section className="container" aria-label="메인 메뉴">
      <div className={styles.wrap}>
        {cards.map(({title, to, color, dark}) => (
          <button
            key={to}
            className={styles.card}
            style={{ background: color, cursor:"pointer" }}
            onClick={() => nav(to)}
            aria-label={`${title} 페이지로 이동`}
          >
            <div className={styles.label}>{title}</div>
            <div className={styles.bottom} style={{ background: dark }} />
          </button>
        ))}
      </div>
    </section>
  );
}
