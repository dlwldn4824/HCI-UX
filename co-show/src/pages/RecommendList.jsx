import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RecommendList.css";

/* ----------------- 선택값 파싱 ----------------- */
function useFilters() {
  const { search, state } = useLocation();
  const q = new URLSearchParams(search);
  return {
    age: q.get("age") ?? state?.age ?? null,
    time: q.get("time") ?? state?.time ?? null,
    method: q.get("method") ?? state?.method ?? null,
  };
}

/* ----------------- CSV 로더(간단) ----------------- */
async function loadCSV(url) {
  const text = await fetch(url).then(r => {
    if (!r.ok) throw new Error(`CSV load failed: ${r.status}`);
    return r.text();
  });

  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = splitCSVLine(lines[0]);
  return lines.slice(1).filter(Boolean).map(line => {
    const cols = splitCSVLine(line);
    const row = {};
    header.forEach((k, i) => row[k] = (cols[i] ?? "").trim());

    // 타입 정리
    row.min_age = row.min_age === "" ? null : Number(row.min_age);
    row.time_max = row.time_max === "" ? null : Number(row.time_max);
    return row;
  });
}
function splitCSVLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

/* ----------------- 정규화 유틸 ----------------- */
function normalizeAge(label) {
  if (!label) return null;
  if (label.includes("누구나")) return 0;
  const m = label.match(/(\d+)\s*세/);
  return m ? Number(m[1]) : null;
}
function normalizeTime(label) {
  if (!label) return null;
  if (label === "5분") return 5;
  const m = label.match(/(\d+)\s*분/);
  return m ? Number(m[1]) : null;
}
function ageToStages(age) {
  if (age == null) return [];
  if (age >= 17) return ["고등", "성인"];
  if (age >= 14) return ["중등", "고등", "성인"];
  if (age >= 11) return ["초등", "중등"];
  if (age >= 8)  return ["초등"];
  return ["유아", "초등"];
}

/* ----------------- 스코어링 ----------------- */
function scoreProgram(p, want) {
  let s = 0;
  if (want.minAge != null) {
    if (typeof p.min_age === "number" && p.min_age >= want.minAge) s += 3;
    const stages = (p.stage || "").split(";").map(t => t.trim());
    if (stages.some(t => want.stages.includes(t))) s += 2;
  }
  if (want.timeMax != null && typeof p.time_max === "number") {
    if (p.time_max <= want.timeMax) s += 2;
    s += (100 - Math.min(p.time_max, 100)) * 0.01;
  }
  if (want.method && p.method === want.method) s += 2;
  return s;
}

export default function RecommendList() {
  const nav = useNavigate();
  const sel = useFilters();

  const want = useMemo(() => {
    const minAge = normalizeAge(sel.age);
    const timeMax = normalizeTime(sel.time);
    return { minAge, timeMax, method: sel.method ?? null, stages: ageToStages(minAge) };
  }, [sel.age, sel.time, sel.method]);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const stripRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await loadCSV("/data/programs.csv");
        setRows(data);
      } catch (e) {
        setErr(e.message || "데이터 로드 실패");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const results = useMemo(() => {
    if (!rows.length) return [];
    let list = [...rows];

    if (want.minAge != null) {
      list = list.filter(p => {
        const stageHit = (p.stage || "")
          .split(";").map(x => x.trim()).some(x => want.stages.includes(x));
        const minAgeHit = typeof p.min_age === "number" ? p.min_age >= want.minAge : false;
        return stageHit || minAgeHit;
      });
    }
    if (want.timeMax != null) {
      list = list.filter(p => typeof p.time_max === "number" ? p.time_max <= want.timeMax : true);
    }
    if (want.method) {
      list = list.filter(p => (p.method || "") === want.method);
    }

    const withScore = list.map(p => ({ ...p, __score: scoreProgram(p, want) }));
    withScore.sort((a, b) => b.__score - a.__score || (a.time_max ?? 1e9) - (b.time_max ?? 1e9));
    return withScore;
  }, [rows, want]);

  // 선택된 아이템
  const [selectedId, setSelectedId] = useState(null);
  useEffect(() => {
    if (results.length && !results.find(r => r.id === selectedId)) {
      setSelectedId(results[0]?.id ?? null);
    }
  }, [results, selectedId]);

  const selected = useMemo(
    () => results.find(r => r.id === selectedId) || null,
    [results, selectedId]
  );

  const summary = useMemo(() => ({
    age: sel.age || "연령 전체",
    time: sel.time || "시간 전체",
    method: sel.method || "모집 전체",
  }), [sel.age, sel.time, sel.method]);

  function scrollStrip(dir = 1) {
    const el = stripRef.current;
    if (!el) return;
    const w = el.clientWidth;
    el.scrollBy({ left: dir * (w * 0.6), behavior: "smooth" });
  }

  if (loading) return <main className="rec-page">불러오는 중…</main>;
  if (err) return <main className="rec-page">에러: {err}</main>;

  return (
    <main className="rec-page">
      
      {/* 상단 상세 패널 */}
      <section className="rec-hero">
        <div className="rec-hero-image" role="img" aria-label={`${selected?.title || "선택된 장소"} 이미지`}>
          {selected?.thumb
            ? <img src={selected.thumb} alt="" />
            : <span className="ghost"></span>}
        </div>

        <div className="rec-hero-desc">
          <div className="desc-card">
            <h2 className="desc-title">{selected?.title || "선택된 장소"}</h2>
            <p className="desc-text">
              {selected?.summary || selected?.desc || "이 존에 대한 설명이 표시됩니다."}
            </p>
            <div className="desc-meta">
              {/* {selected?.zone && <span>ZONE {selected.zone}</span>} */}
              {typeof selected?.min_age === "number" && <span>{selected.min_age}세+</span>}
              {typeof selected?.time_max === "number" && <span>{selected.time_max}분</span>}
              {selected?.method && <span>{selected.method}</span>}
            </div>
            {selected && (
              <button
                className="primary-go"
                type="button"
                onClick={() => nav(`/recommend/${selected.id}`)}
              >
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 하단 스트립(스크롤) */}
      <section className="rec-strip">
        <button
          type="button"
          className="strip-nav prev"
          aria-label="이전"
          onClick={() => scrollStrip(-1)}
        >
          ‹
        </button>

        <div className="strip-scroll" ref={stripRef}>
          {results.map(p => {
            const active = p.id === selectedId;
            return (
              <button
                key={p.id}
                type="button"
                className={`strip-item ${active ? "active" : ""}`}
                onClick={() => setSelectedId(p.id)}
                aria-pressed={active}
                aria-label={`${p.title} 선택`}
              >
                <div className="thumb">
                  {p.thumb ? <img src={p.thumb} alt="" /> : <span className="ghost">이미지</span>}
                </div>

                {/* ✅ 프로그램명만 출력 */}
                <div className="strip-title">{p.title}</div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="strip-nav next"
          aria-label="다음"
          onClick={() => scrollStrip(1)}
        >
          ›
        </button>
      </section>

    </main>
  );
}
