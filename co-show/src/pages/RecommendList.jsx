// RecommendList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/RecommendList.css";

/* ---------- CSV 유틸 ---------- */
async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = splitCSVLine(lines[0]).map(h => h.replace(/^\uFEFF/, "").trim());
  return lines.slice(1).filter(Boolean).map(line => {
    const cols = splitCSVLine(line);
    const row = {};
    header.forEach((k, i) => (row[k] = (cols[i] ?? "").trim()));
    return row;
  });
}
function splitCSVLine(line) {
  const out = []; let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}
const EMPTY = new Set(["", "—", "-", "?", "없음", "N/A", "n/a"]);
const clean = v => {
  if (v == null) return "";
  const s = String(v).trim();
  return EMPTY.has(s) ? "" : s;
};

/* ---------- Normalizers ---------- */
function normalizeStageSet(raw) {
  const s = (raw || "").replace(/\s+/g, "");
  const set = new Set();
  if (!s || s === "누구나") {
    ["유아", "초등", "중등", "고등", "성인"].forEach(set.add, set);
    return set;
  }
  const has = kw => s.includes(kw);
  if (has("유아")) set.add("유아");
  if (has("초등")) set.add("초등");
  if (has("중등") || has("중학생")) set.add("중등");
  if (has("고등") || has("고등학생")) set.add("고등");
  if (has("성인")) set.add("성인");
  if (has("이상")) {
    if (set.has("초등")) { set.add("중등"); set.add("고등"); set.add("성인"); }
    if (set.has("중등")) { set.add("고등"); set.add("성인"); }
    if (set.has("고등")) { set.add("성인"); }
  }
  return set;
}
function parseTimeToMinutes(s) {
  if (!s) return null;
  const t = s.replace(/\s+/g, "");
  if (t === "상시") return 9999;
  const hr = t.match(/(\d+)\s*시간/);
  const mn = t.match(/(\d+)\s*분/);
  if (hr) {
    const H = parseInt(hr[1], 10);
    const M = mn ? parseInt(mn[1], 10) : 0;
    return H * 60 + M;
  }
  if (t.includes("이내")) {
    const m = t.match(/(\d+)\s*분/);
    return m ? parseInt(m[1], 10) : null;
  }
  const range = t.match(/(\d+)\s*~\s*(\d+)분/) || t.match(/(\d+)~(\d+)분/);
  if (range) return parseInt(range[2], 10);
  const onlyMin = mn ? parseInt(mn[1], 10) : null;
  return Number.isFinite(onlyMin) ? onlyMin : null;
}
function splitMethods(raw) {
  return (raw || "")
    .split("/")
    .map(s => s.trim())
    .filter(Boolean);
}

/* ---------- 쿼리→내부필터 매핑 ---------- */
function mapAgeToStage(ageLabel) {
  switch (ageLabel) {
    case "누구나": return "전체";
    case "8세 이상": return "초등";
    case "11세 이상": return "초등";
    case "14세 이상": return "중등";
    case "17세 이상": return "고등";
    default: return "전체";
  }
}
function mapTimeLabelToKey(timeLabel) {
  if (!timeLabel) return "전체";
  const t = timeLabel.replace(/\s+/g, "");
  if (t === "5분") return "5";
  if (t.startsWith("15분")) return "15";
  if (t.startsWith("30분")) return "30";
  if (t.startsWith("60분")) return "60";
  if (t.startsWith("90분")) return "90";
  return "전체";
}
function normalizeMethodLabel(m) {
  return m === "현장접수" || m === "사전접수" ? m : "전체";
}

/* ---------- 이미지 폴백 ---------- */
const FALLBACK_HERO = "/images/fallback.png";
const FALLBACK_THUMB = "/images/fallback-thumb.png";

/* ---------- Component ---------- */
export default function RecommendList() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const stripRef = useRef(null);

  // 필터 상태
  const [stageSel, setStageSel] = useState("전체");
  const [methodSel, setMethodSel] = useState("전체");
  const [timeSel, setTimeSel] = useState("전체");

  // URL 쿼리 & location.state → 초기 필터 반영
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const qsAge = sp.get("age") ?? location.state?.age ?? null;
    const qsTime = sp.get("time") ?? location.state?.time ?? null;
    const qsMethod = sp.get("method") ?? location.state?.method ?? null;

    setStageSel(qsAge ? mapAgeToStage(qsAge) : "전체");
    setTimeSel(qsTime ? mapTimeLabelToKey(qsTime) : "전체");
    setMethodSel(qsMethod ? normalizeMethodLabel(qsMethod) : "전체");
  }, [location.search, location.state]);

  // CSV 로드
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const raw = await loadCSV("/data/programs.csv"); // public/data/programs.csv
        const mapped = raw.map((r, i) => {
          const stage = clean(r["stage"]);
          const title = clean(r["title"]);
          const intro = clean(r["introdustion"]);        // 오타 열명 그대로
          const timeRaw = clean(r["time_max"]);
          const method = clean(r["method"]);
          const image = clean(r["image"]);               // ✅ CSV의 image 경로 사용 (예: /images/programs/xxx.webp)

          return {
            id: i + 1,
            title,
            stageRaw: stage,
            stageSet: normalizeStageSet(stage),
            methods: splitMethods(method),
            methodRaw: method,
            timeRaw,
            timeMin: parseTimeToMinutes(timeRaw),
            tags: clean(r["tags"]),
            introdustion: intro,
            image,                                       // ✅ 저장
          };
        });
        if (!alive) return;
        setRows(mapped);
        setSelected(mapped[0] || null);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "데이터 로드 실패");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // 드롭다운 옵션
  const stageOptions = ["전체", "유아", "초등", "중등", "고등", "성인"];
  const methodOptions = useMemo(() => {
    const set = new Set(["전체"]);
    rows.forEach(r => r.methods.forEach(m => set.add(m)));
    return Array.from(set);
  }, [rows]);
  const timeOptions = ["전체", "5", "10", "15", "20", "30", "40", "60", "90"];

  // 필터링
  const filtered = useMemo(() => {
    return rows.filter(p => {
      if (stageSel !== "전체" && !p.stageSet.has(stageSel)) return false;
      if (methodSel !== "전체" && (p.methods.length === 0 || !p.methods.includes(methodSel))) return false;
      if (timeSel !== "전체") {
        const limit = parseInt(timeSel, 10);
        if (!Number.isFinite(p.timeMin) || p.timeMin > limit) return false;
      }
      return true;
    });
  }, [rows, stageSel, methodSel, timeSel]);

  // 선택 보정
  useEffect(() => {
    if (!filtered.length) { setSelected(null); return; }
    if (!selected || !filtered.find(x => x.id === selected.id)) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  // 스트립 스크롤
  const scrollStrip = (dir = 1) => {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.6), behavior: "smooth" });
  };

  if (loading) return <main className="rec-page">불러오는 중…</main>;
  if (err) return <main className="rec-page">에러: {err}</main>;

  return (
    <main className="rec-page">
      {/* 필터 바 */}
      <div className="rec-filterbar" style={{ display: "flex", gap: 12 }}>
        <select value={stageSel} onChange={e => setStageSel(e.target.value)}>
          {stageOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select value={methodSel} onChange={e => setMethodSel(e.target.value)}>
          {methodOptions.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        <select value={timeSel} onChange={e => setTimeSel(e.target.value)}>
          {timeOptions.map(o => (
            <option key={o} value={o}>
              {o === "전체" ? "시간 전체" : `최대 ${o}분`}
            </option>
          ))}
        </select>

        <div style={{ marginLeft: "auto", opacity: 0.7 }}>
          결과: {filtered.length}개
        </div>
      </div>

      {/* 상단 상세 */}
      <section className="rec-hero">
        <div className="rec-hero-image">
          {selected?.image ? (
            <img
              src={selected.image}
              alt={selected.title}
              loading="lazy"
              onError={(e) => { e.currentTarget.src = FALLBACK_HERO; }}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={FALLBACK_HERO}
              alt="기본 이미지"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )}
        </div>

        <div className="rec-hero-desc">
          <div className="desc-card">
            <h2 className="desc-title">{selected?.title || "프로그램명"}</h2>
            <p className="desc-text">
              {selected?.introdustion || "이 프로그램에 대한 설명이 없습니다."}
            </p>
            <div className="desc-meta">
              {selected?.stageRaw && <span>{selected.stageRaw}</span>}
              {selected?.timeRaw && <span>{selected.timeRaw}</span>}
              {selected?.methodRaw && <span>{selected.methodRaw}</span>}
            </div>
            <button
              className="primary-go"
              type="button"
              onClick={() => selected && alert(`${selected.title} 상세 페이지로 이동`)}
            />
          </div>
        </div>
      </section>

      {/* 하단 스트립 */}
      <section className="rec-strip">
        <button type="button" className="strip-nav prev" onClick={() => scrollStrip(-1)} aria-label="이전">‹</button>

        <div className="strip-scroll" ref={stripRef}>
          {filtered.length === 0 ? (
            <div className="rec-empty">조건에 맞는 프로그램이 없어요.</div>
          ) : (
            filtered.map(p => {
              const active = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`strip-item ${active ? "active" : ""}`}
                  onClick={() => setSelected(p)}
                  aria-pressed={active}
                >
                  <div className="thumb">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.title}
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = FALLBACK_THUMB; }}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <img
                        src={FALLBACK_THUMB}
                        alt="기본 썸네일"
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    )}
                  </div>
                  <div className="strip-title">{p.title}</div>
                </button>
              );
            })
          )}
        </div>

        <button type="button" className="strip-nav next" onClick={() => scrollStrip(1)} aria-label="다음">›</button>
      </section>
    </main>
  );
}
