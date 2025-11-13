import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";  // ✅ 여기!
import styles from "../styles/TrainNav.module.css";

import head from "../assets/train/기차머리.svg";
import TRAIN_IMG from "../assets/train/기차.svg";

const ZONES = [
  "실감미디어", "데이터보안", "미래자동차", "이차전지", "바이오헬스", "지능형로봇",
  "에너지신산업", "에코업", "빅데이터", "차세대디스플레이", "인공지능",
  "차세대통신", "첨단소재", "차세대 반도체", "그린바이오", "사물인터넷",
  "반도체소부장", "항공드론"
];

const cars = ZONES.map((z) => ({
  label: `${z}존`,
  to: `/zone/${z}`,
  img: TRAIN_IMG,
}));

export default function TrainNav() {
  const nav = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const handleScroll = () => {
    setIsScrolling(true);

    // 기존 타이머 지우고
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    // 300ms 동안 스크롤이 없으면 다시 애니메이션 ON
    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
  };

  const TrainSet = ({ sfx = "" }) => (
    <div className={styles.segment}>
      <img src={head} alt="기관차" className={styles.head} />
      {cars.map(({ label, to, img }, i) => (
        <button
          key={`${sfx}-${i}`}
          className={styles.carBtn}
          onClick={() => nav(to)}
        >
          <div className={styles.carWrap}>
            <span className={styles.carLabel}>{label}</span>
            <img src={img} alt={label} className={styles.carImg} />
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <section className={styles.canvas}>
      <div
        className={styles.scrollArea}
        onScroll={handleScroll}
      >
        <div
          className={`${styles.track} ${
            isScrolling ? styles.pause : ""
          }`}
        >
          <TrainSet sfx="a" />
          <TrainSet sfx="b" />
        </div>
      </div>
    </section>
  );
}
