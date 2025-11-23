import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/TrainNav.module.css";
import goBtnImg from "../assets/train/체험존구경가기버튼.svg";
import { ZONE_INFO } from "../data/zoneIntro.js";

import head from "../assets/train/기차머리.svg";
import TRAIN_IMG from "../assets/train/기차.svg";

const ZONES = [
  "실감미디어", "데이터보안", "미래자동차", "이차전지", "바이오헬스", "지능형로봇",
  "에너지신산업", "에코업", "빅데이터", "차세대디스플레이", "인공지능",
  "차세대통신", "첨단소재", "차세대 반도체", "그린바이오", "사물인터넷",
  "반도체소부장", "항공드론"
];

// ⭐ 각 칸이 어떤 존인지 zone 필드 추가
const cars = ZONES.map((z) => ({
  zone: z,
  label: `${z}존`,
  to: `/zone/${z}`,
  img: TRAIN_IMG,
}));

export default function TrainNav() {
  const nav = useNavigate();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeout = useRef(null);

  const [selectedZone, setSelectedZone] = useState(null);

  const handleScroll = () => {
    setIsScrolling(true);

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
      setIsScrolling(false);
    }, 300);
    

  };
       // ⭐ 공통 선택 함수
  const handleSelectZone = (zone) => {
    setSelectedZone(zone);
  };

  // 🚂 기차 한 세트
  const TrainSet = ({ sfx = "" }) => (
    <div className={styles.segment}>
      <img src={head} alt="기관차" className={styles.head} />
      {cars.map(({ label, to, img, zone }, i) => (
        <button
          key={`${sfx}-${i}`}
          className={styles.carBtn}
          onClick={() => {
            setSelectedZone(zone); // 기차 클릭 시에도 선택 존 변경
          }}
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
      {/* 🔹 제목 영역 */}
      <h2 className={styles.title}>
        이동하고 싶은 장소를 눌러주세요!
      </h2>

      {/* 🔹 존 지도 + 상세 영역 */}
      <div className={styles.zoneArea}>
        {/* 🔹 존 지도 + 상세 영역 */}
      <div className={styles.zoneArea}>
        
        {/* === 그림 형태 지도 === */}
        <div className={styles.zoneMap}>

          {/* 회색 영역: 무대 콘솔 */}
          <div className={styles.stage}>무대 콘솔</div>

          {/* 가운데 다이아: coss 스피어 */}
          <div className={styles.coss}>
            <span>coss</span>
            <span>스피어</span>
          </div>

          {/* 각 존 버튼 */}
          <button
            style={{ gridArea: "media" }}
            className={`${styles.zoneBtn} ${selectedZone === "실감미디어" ? styles.zoneBtnSelected : ""}`}
            onClick={() => {
              handleSelectZone("실감미디어");
            }}
          >
            실감미디어
          </button>

          <button style={{ gridArea: "data" }}
            className={`${styles.zoneBtn} ${selectedZone === "데이터보안" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("데이터보안")}
          >
            데이터보안
          </button>

          <button style={{ gridArea: "car" }}
            className={`${styles.zoneBtn} ${selectedZone === "미래자동차" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("미래자동차")}
          >
            미래자동차
          </button>

          <button style={{ gridArea: "battery" }}
            className={`${styles.zoneBtn} ${selectedZone === "이차전지" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("이차전지")}
          >
            이차전지
          </button>

          <button
            style={{ gridArea: "bio" }}
            className={`${styles.zoneBtn} ${styles.zoneBtnBio} ${
              selectedZone === "바이오헬스" ? styles.zoneBtnSelected : ""
            }`}
            onClick={() => handleSelectZone("바이오헬스")}
          >
            바이오헬스
          </button>


          <button
          style={{ gridArea: "robot" }}
          className={`${styles.zoneBtn} ${styles.zoneBtnRobot} ${
            selectedZone === "지능형로봇" ? styles.zoneBtnSelected : ""
          }`}
          onClick={() => handleSelectZone("지능형로봇")}
        >
          지능형로봇
        </button>


          <button style={{ gridArea: "energy" }}
            className={`${styles.zoneBtn} ${selectedZone === "에너지신산업" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("에너지신산업")}
          >
            에너지신산업
          </button>

          <button style={{ gridArea: "eco" }}
            className={`${styles.zoneBtn} ${selectedZone === "에코업" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("에코업")}
          >
            에코업
          </button>

          <button style={{ gridArea: "big" }}
            className={`${styles.zoneBtn} ${selectedZone === "빅데이터" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("빅데이터")}
          >
            빅데이터
          </button>

          <button style={{ gridArea: "display" }}
            className={`${styles.zoneBtn} ${styles.zoneBtnDisplay} ${
              selectedZone === "차세대디스플레이" ? styles.zoneBtnSelected : ""
            }`}
            onClick={() => handleSelectZone("차세대디스플레이")}
          >
            차세대 <br></br>
            디스플레이
          </button>

          <button style={{ gridArea: "ai" }}
          className={`${styles.zoneBtn} ${styles.zoneBtnAI} ${
            selectedZone === "인공지능" ? styles.zoneBtnSelected : ""
          }`}
          onClick={() => handleSelectZone("인공지능")}
          >
            인공지능
          </button>

          <button style={{ gridArea: "comm" }}
            className={`${styles.zoneBtn} ${selectedZone === "차세대통신" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("차세대통신")}
          >
            차세대통신
          </button>

          <button style={{ gridArea: "material" }}
            className={`${styles.zoneBtn} ${selectedZone === "첨단소재" ? styles.zoneBtnSelected : ""}`}
            onClick={() => handleSelectZone("첨단소재")}
          >
            첨단소재
          </button>

          <button style={{ gridArea: "semiNext" }}
            className={`${styles.zoneBtn} ${selectedZone === "차세대 반도체" ? styles.zoneBtnSelected : ""}`}
            onClick={() => setSelectedZone("차세대 반도체")}
          >
            차세대 반도체
          </button>

          <button style={{ gridArea: "green" }}
            className={`${styles.zoneBtn} ${styles.zoneBtnGreen} ${
            selectedZone === "그린바이오" ? styles.zoneBtnSelected : ""}`}
            onClick={() => setSelectedZone("그린바이오")}            
          >
            그린바이오
          </button>

          <button style={{ gridArea: "iot" }}
            className={`${styles.zoneBtn} ${styles.zoneBtnIot} ${
            selectedZone === "사물인터넷" ? styles.zoneBtnSelected : ""
          }`}
          onClick={() => setSelectedZone("사물인터넷")} 
          >
            사물인터넷
          </button>

          <button style={{ gridArea: "semiPart" }}
            className={`${styles.zoneBtn} ${selectedZone === "반도체소부장" ? styles.zoneBtnSelected : ""}`}
            onClick={() => setSelectedZone("반도체소부장")}
          >
            반도체소부장
          </button>

          <button style={{ gridArea: "drone" }}
            className={`${styles.zoneBtn} ${selectedZone === "항공드론" ? styles.zoneBtnSelected : ""}`}
            onClick={() => setSelectedZone("항공드론")}
          >
            항공드론
          </button>

        </div>

        {/* 🔸 오른쪽 상세 패널 그대로 */}
          <div className={styles.zoneDetail}>
            {selectedZone ? (
              <>
                <h3>{selectedZone}</h3>

                {/* 🔹 소개 문구 */}
                <p>
                  {ZONE_INFO[selectedZone]?.intro ??
                    `${selectedZone} 존에 대한 소개 문구가 준비 중입니다.`}
                </p>

                {/* 🔹 체험 리스트 */}
                <div className={styles.experienceList}>
                  <h4 style={{ fontSize: "30px", marginBottom: "10px" }}>체험 목록</h4>

                  {ZONE_INFO[selectedZone]?.experiences?.length > 0 ? (
                    ZONE_INFO[selectedZone].experiences.map((exp, idx) => (
                      <div key={idx} className={styles.experienceItem}>
                        • {exp}
                      </div>
                    ))
                  ) : (
                    <p>체험 정보가 없습니다.</p>
                  )}
                </div>

                {/* 지능형로봇일 때만 버튼 표시 */}
                {selectedZone === "지능형로봇" && (
                  <button className={styles.goBtn} onClick={() => nav("/search")}>
                    <img src={goBtnImg} className={styles.btnImg} />
                  </button>
                )}
              </>
            ) : (
              <p style={{ textAlign: "center" }}>
                관심 있는 존을 클릭하면 <br />오른쪽에 세부 정보가 표시됩니다.
              </p>
            )}
          </div>


      </div>

      </div>

      {/* 🔹 스크롤 / 기차 영역 */}
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
