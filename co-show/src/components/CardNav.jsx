import { useNavigate } from "react-router-dom";
import styles from "./CardNav.module.css";

const cards = [
  { title: "전시장 안내", to: "/guide", cls: "card01" },
  { title: "경진 대회 일정", to: "/schedule", cls: "card02" },
  { title: "이벤트 참여", to: "/quizIntro", cls: "card03" },
  { title: "사진 촬영", to: "/photo", cls: "card04" },
  { title: "문의", to: "/inquiry", cls: "card05" },
];

export default function CardNav() {
  const nav = useNavigate();

  return (
    <section className="container">
      <div className={styles.wrap}>
        {cards.map(({ title, to, cls }) => (
          <button
            key={to}
            className={`${styles.card} ${styles[cls]}`}
            onClick={() => nav(to)}
            aria-label={title}
          >
          </button>
        ))}
      </div>
    </section>
  );
}
