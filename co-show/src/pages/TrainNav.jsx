import { useNavigate } from "react-router-dom";
import styles from "../styles/TrainNav.module.css";

const cars = [
  { label: "A존으로 가기", to: "/zone/A" },
  { label: "B존으로 가기", to: "/zone/B" },
  { label: "C존으로 가기", to: "/zone/C" },
  { label: "D존으로 가기", to: "/zone/D" },
  { label: "E존으로 가기", to: "/zone/E" },
  { label: "F존으로 가기", to: "/zone/F" },
];

export default function TrainNav() {
  const nav = useNavigate();

  // 트랙을 2번 렌더링해서 매끄러운 무한루프
  const renderCars = (suffix="") => (
    cars.map(({label, to}, i) => (
      <button
        key={`${suffix}${i}`}
        className={styles.car}
        onClick={() => nav(to)}
        aria-label={label}
      >
        <div className={styles.roof} />
        <div className={styles.body}>{label}</div>
        <div className={styles.base} />
        <div className={styles.wheels}>
          <span /><span />
        </div>
      </button>
    ))
  );

  return (
    <div className={styles.marqueeWrap} aria-label="기차 네비게이션">
      <div className={styles.track}>
        <div className={styles.segment}>{renderCars("a")}</div>
        <div className={styles.segment}>{renderCars("b")}</div>
      </div>
    </div>
  );
}
