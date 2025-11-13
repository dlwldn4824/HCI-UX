import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";   
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
  const [search, setSearch] = useState("");
  const navigate = useNavigate();   

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((r) => {
      const cons = (r["컨소시엄명"] || "").toLowerCase();
      const name = (r["경진대회명"] || "").toLowerCase();
      return cons.includes(q) || name.includes(q);
    });
  }, [rows, search]);

  // ✅ 버튼 클릭 시 상세페이지로 이동하는 함수
  const handleClickRow = (row) => {
    navigate("/schedule/detail", {
      state: { row },  // row 통째로 넘기기
    });
  };

  return (
    <main className="sch-page">
      {err && (
        <div className="contest-error">
          데이터 로드 중 오류가 발생했어요: {err}
        </div>
      )}

      <input
        className="contest-search-input"
        type="text"
        placeholder="컨소시엄명 또는 경진대회명을 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button
        type="button"
        className="contest-search-btn"
        onClick={() => {}}
        aria-label="검색"
      >
        🔍
      </button>

      <div className="contest-viewport">
        <div className="contest-wrap">
          {filtered.map((r, idx) => (
            <button
              key={idx}
              type="button"
              className="contest-btn"
              onClick={() => handleClickRow(r)}   // ✅ 여기!
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
