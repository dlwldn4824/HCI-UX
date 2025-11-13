import { useEffect, useState, useMemo } from "react";
import "../styles/schedule.css";

/* CSV 로드 유틸 */
async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",").map(h => h.replace(/^\uFEFF/, "").trim());

  return lines.slice(1).filter(Boolean).map(line => {
    const cols = line.split(",").map(c => c.trim());
    const row = {};
    header.forEach((k, i) => {
      row[k] = cols[i] ?? "";
    });
    return row;
  });
}

export default function Schedule() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");   // ✅ 검색어 하나만 사용

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const data = await loadCSV("/data/Competition.csv");
        setRows(data);
      } catch (e) {
        console.error(e);
        setErr(e.message || "데이터 로드 실패");
      }
    })();
  }, []);

  // ✅ 검색어가 바뀔 때마다 바로 필터링
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const cons = (r["컨소시엄명"] || "").toLowerCase();
      const name = (r["경진대회명"] || "").toLowerCase();
      return cons.includes(q) || name.includes(q);
    });
  }, [rows, search]);

  return (
    <main className="sch-page">
      {err && (
        <div className="contest-error">
          데이터 로드 중 오류가 발생했어요: {err}
        </div>
      )}

      {/* 🔍 검색 입력창 */}
      <input
        className="contest-search-input"
        type="text"
        placeholder="컨소시엄명 또는 경진대회명을 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}   // ✅ 타이핑/지우기 즉시 반영
      />

      {/* 🔍 돋보기 버튼 (원하면 여기에 다른 기능 넣어도 됨) */}
      <button
        type="button"
        className="contest-search-btn"
        onClick={() => { /* 지금은 굳이 안 써도 됨 */ }}
        aria-label="검색"
      >
        🔍
      </button>

      {/* 스크롤 리스트 영역 */}
      <div className="contest-viewport">
        <div className="contest-wrap">
          {filtered.map((r, idx) => (
            <button
              key={idx}
              type="button"
              className="contest-btn"
            >
              <div className="contest-name">{r["경진대회명"]}</div>
              <div className="contest-consortium">{r["컨소시엄명"]}</div>
            </button>
          ))}

          {filtered.length === 0 && rows.length > 0 && (
            <div className="contest-empty">검색 결과가 없습니다.</div>
          )}

          {rows.length === 0 && !err && (
            <div className="contest-empty">불러온 경진대회가 없습니다.</div>
          )}
        </div>
      </div>
    </main>
  );
}
