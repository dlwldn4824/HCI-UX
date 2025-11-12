import React, { useEffect, useState, useRef } from "react";
import "../styles/RecommendList.css";

/* --- CSV 파서 --- */
async function loadCSV(url) {
  const text = await fetch(url).then((r) => {
    if (!r.ok) throw new Error(`CSV load failed: ${r.status}`);
    return r.text();
  });
  const lines = text.trim().split(/\r?\n/);
  const header = splitCSVLine(lines[0]).map((h) => h.replace(/^\uFEFF/, "").trim());
  return lines.slice(1).map((line) => {
    const cols = splitCSVLine(line);
    const row = {};
    header.forEach((k, i) => (row[k] = (cols[i] ?? "").trim()));
    return row;
  });
}

function splitCSVLine(line) {
  const out = [];
  let cur = "", inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

const EMPTY = new Set(["", "—", "-", "?", "없음", "N/A", "n/a"]);
const clean = (v) => {
  if (v == null) return "";
  const s = String(v).trim();
  return EMPTY.has(s) ? "" : s;
};

/* --- 메인 컴포넌트 --- */
export default function RecommendList() {
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const stripRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const raw = await loadCSV("../../public/data/programs.csv"); // CSV 경로
        const mapped = raw.map((r, i) => ({
          id: i + 1,
          stage: clean(r["stage"]),
          title: clean(r["title"]),
          tags: clean(r["tags"]),
          introdustion: clean(r["introdustion"]),
          time_max: clean(r["time_max"]),
          method: clean(r["method"]),
        }));
        setRows(mapped);
        setSelected(mapped[0]); // 첫 항목 기본 선택
      } catch (e) {
        setErr(e.message || "데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function scrollStrip(dir = 1) {
    const el = stripRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w * 0.6), behavior: "smooth" });
  }

  if (loading) return <main className="rec-page">불러오는 중...</main>;
  if (err) return <main className="rec-page">에러: {err}</main>;

  return (
    <main className="rec-page">
      {/* 상단 상세 */}
      <section className="rec-hero">
        {/* 왼쪽 이미지 영역 (빈칸) */}
        <div className="rec-hero-image">
          <span className="ghost">이미지</span>
        </div>

        {/* 오른쪽 설명 */}
        <div className="rec-hero-desc">
          <div className="desc-card">
            <h2 className="desc-title">{selected?.title || "프로그램명"}</h2>

            <p className="desc-text">
              {selected?.introdustion || "이 프로그램에 대한 설명이 없습니다."}
            </p>

            <div className="desc-meta">
              {selected?.stage && <span>{selected.stage}</span>}
              {selected?.time_max && <span>{selected.time_max}</span>}
              {selected?.method && <span>{selected.method}</span>}
            </div>

            <button
              className="primary-go"
              type="button"
              onClick={() => alert(`${selected?.title} 상세 페이지로 이동`)}
            ></button>
          </div>
        </div>
      </section>

      {/* 하단 스크롤 스트립 */}
      <section className="rec-strip">
        <button
          type="button"
          className="strip-nav prev"
          onClick={() => scrollStrip(-1)}
        >
          ‹
        </button>

        <div className="strip-scroll" ref={stripRef}>
          {rows.map((p) => {
            const active = selected?.id === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`strip-item ${active ? "active" : ""}`}
                onClick={() => setSelected(p)}
              >
                <div className="thumb">
                  <span className="ghost">이미지</span>
                </div>
                <div className="strip-title">{p.title}</div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="strip-nav next"
          onClick={() => scrollStrip(1)}
        >
          ›
        </button>
      </section>
    </main>
  );
}
