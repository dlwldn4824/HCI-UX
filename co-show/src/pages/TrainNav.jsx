import { useNavigate } from "react-router-dom";
import styles from "../styles/TrainNav.module.css";

// 🚂 기관차
import head from "../assets/train/train_head.svg";

// 🚃 객차 (각 존 버튼)
import carA from "../assets/train/train_car_A.svg";
import carB from "../assets/train/train_car_B.svg";
import carC from "../assets/train/train_car_C.svg";
import carD from "../assets/train/train_car_D.svg";
import carE from "../assets/train/train_car_E.svg";
import carF from "../assets/train/train_car_F.svg";

const cars = [
  { label: "A존", to: "/zone/A", img: carA },
  { label: "B존", to: "/zone/B", img: carB },
  { label: "C존", to: "/zone/C", img: carC },
  { label: "D존", to: "/zone/D", img: carD },
  { label: "E존", to: "/zone/E", img: carE },
  { label: "F존", to: "/zone/F", img: carF },
];

export default function TrainNav() {
  const nav = useNavigate();

  // 한 줄의 기차 세트
  const TrainSet = ({ sfx = "" }) => (
    <div className={styles.segment}>
      <img src={head} alt="기관차" className={styles.head} />
      {cars.map(({ label, to, img }, i) => (
        <button
          key={`${sfx}-${i}`}
          className={styles.carBtn}
          onClick={() => nav(to)}
          aria-label={label}
        >
          <img src={img} alt={label} />
        </button>
      ))}
    </div>
  );

  return (
    <section className={styles.canvas} aria-label="기차 네비게이션">
      <div className={styles.track}>
        {/* 트랙을 2번 렌더링 → 끊김 없이 무한 반복 */}
        <TrainSet sfx="a" />
        <TrainSet sfx="b" />
      </div>
    </section>
  );
}
