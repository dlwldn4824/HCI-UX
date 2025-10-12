import { useMemo, useState, useEffect } from "react";
import "../styles/schedule.css";

// 목업 데이터 (원하면 JSON으로 분리 가능)
const DATA = [
  {
    id: "k01",
    category: "카테고리A",
    date: "2024-10-01",
    name: "로보틱스 워크숍",
    photoLabel: "사진",
    desc: "로봇 제어 기초 실습과 쇼케이스",
    timetable: [
      { time: "10:00", what: "오리엔테이션" },
      { time: "11:00", what: "모터 컨트롤 데모" },
      { time: "14:00", what: "팀별 미니 프로젝트" },
    ],
  },
  {
    id: "k02",
    category: "카테고리B",
    date: "2024-10-02",
    name: "AI 아트 전시",
    photoLabel: "사진",
    desc: "생성형 AI로 만든 인터랙티브 아트",
    timetable: [
      { time: "09:30", what: "큐레이션 투어" },
      { time: "13:00", what: "작가와의 대화" },
      { time: "16:30", what: "현장 피드백" },
    ],
  },
  {
    id: "k03",
    category: "카테고리C",
    date: "2024-10-03",
    name: "HCI 스터디",
    photoLabel: "사진",
    desc: "사용성 평가와 페이퍼 프로토타입",
    timetable: [
      { time: "10:30", what: "사용성 테스트 소개" },
      { time: "12:00", what: "페이퍼 프로토타입" },
      { time: "15:00", what: "리뷰 세션" },
    ],
  },
];

const CATS = ["전체", ...Array.from(new Set(DATA.map(d => d.category)))];

export default function Schedule() {
  const [cat, setCat] = useState("전체");
  const filtered = useMemo(
    () => (cat === "전체" ? DATA : DATA.filter(d => d.category === cat)),
    [cat]
  );

  const [idx, setIdx] = useState(0);
  const cur = filtered[idx] ?? filtered[0];

  useEffect(() => { setIdx(0); }, [cat]); // 카테고리 바뀌면 첫 카드로

  // 키보드 좌우 이동
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setIdx(i => (i + 1) % filtered.length);
      if (e.key === "ArrowLeft")  setIdx(i => (i - 1 + filtered.length) % filtered.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered.length]);

  const next = () => setIdx(i => (i + 1) % filtered.length);
  const prev = () => setIdx(i => (i - 1 + filtered.length) % filtered.length);

  return (
    <main className="sch-page">
      <h2 className="sch-title">전시 일정</h2>

      {/* 상단 카테고리 탭 */}
      <div className="sch-tabs" role="tablist" aria-label="카테고리">
        {CATS.map(c => (
          <button
            key={c}
            className={`sch-tab ${c === cat ? "is-active" : ""}`}
            role="tab"
            aria-selected={c === cat}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 날짜 헤더 */}
      <div className="sch-date">
        {formatDate(cur?.date)} <span className="sch-day">{weekday(cur?.date)}</span>
      </div>

      <section className="sch-grid">
        {/* 왼쪽 카드 */}
        <article className="sch-card">
          <header className="sch-card-head">
            <strong className="sch-name">{cur?.name}</strong>
          </header>

          <div className="sch-card-body">
            <div className="sch-photo" aria-label="사진 영역">{cur?.photoLabel}</div>
            <div className="sch-desc" aria-label="설명글">{cur?.desc}</div>
          </div>

          {/* 하단 네비게이션 */}
          <footer className="sch-card-foot">
            <button className="sch-step" onClick={prev} aria-label="이전">‹</button>
            <span className="sch-counter">{idx + 1} / {filtered.length}</span>
            <button className="sch-step" onClick={next} aria-label="다음">›</button>
          </footer>
        </article>

        {/* 오른쪽 일정표 */}
        <aside className="sch-aside">
          <div className="sch-aside-head">일정표</div>
          <ul className="sch-table" aria-label="타임테이블">
            {cur?.timetable?.map((t, i) => (
              <li key={i} className="sch-row">
                <time className="sch-time">{t.time}</time>
                <span className="sch-what">{t.what}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}

function formatDate(d){
  if(!d) return "";
  const [y,m,day] = d.split("-").map(Number);
  return `${y}.${String(m).padStart(2,"0")}.${String(day).padStart(2,"0")}`;
}
function weekday(d){
  if(!d) return "";
  const wd = new Date(d).getDay();
  return ["(일)","(월)","(화)","(수)","(목)","(금)","(토)"][wd];
}
