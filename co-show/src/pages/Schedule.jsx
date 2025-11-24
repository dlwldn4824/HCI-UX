import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/schedule.css";

/* CSV 로드 유틸 */
async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CSV load failed: ${res.status}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const header = lines[0].split(",").map((h) => h.replace(/^\uFEFF/, "").trim());

  return lines
    .slice(1)
    .filter(Boolean)
    .map((line) => {
      const cols = line.split(",").map((c) => c.trim());
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
  const [dayFilter, setDayFilter] = useState("ALL"); // 🔹 요일 필터 상태
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

  // 🔹 요일 버튼 (11.26~11.29만)
  const DAY_BUTTONS = [
    { label: "전체", value: "ALL" },
    { label: "11.26 (수)", value: "수" },
    { label: "11.27 (목)", value: "목" },
    { label: "11.28 (금)", value: "금" },
    { label: "11.29 (토)", value: "토" },
  ];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let base = rows;

    // 🔍 검색 필터 (컨소시엄명 / 경진대회명)
    if (q) {
      base = base.filter((r) => {
        const cons = (r["컨소시엄명"] || "").toLowerCase();
        const name = (r["경진대회명"] || "").toLowerCase();
        return cons.includes(q) || name.includes(q);
      });
    }

    // 🗓 요일 필터 (일정 및 장소 컬럼 안에 (수)(목)(금)(토) 포함 여부로 필터링)
    if (dayFilter !== "ALL") {
      base = base.filter((r) => {
        const schedule = r["일정 및 장소"] || "";
        // 예: "11.26(수)~11.28(금) 부산 BEXCO"
        //      "(수)", "(금)" 이런 식으로 들어있으니 괄호까지 같이 찾기
        return schedule.includes(`(${dayFilter})`);
      });
    }

    return base;
  }, [rows, search, dayFilter]);

  // ✅ 버튼 클릭 시 상세페이지로 이동하는 함수
  const handleClickRow = (row) => {
    navigate("/schedule/detail", {
      state: { row }, // row 통째로 넘기기
    });
  };

  return (
    <main className="sch-page">
      {err && (
        <div className="contest-error">
          데이터 로드 중 오류가 발생했어요: {err}
        </div>
      )}

      <h1 className="sch-title">경진 대회 목록</h1>

      {/* 🔹 검색 + 요일 필터 묶음 */}
      <div className="contest-top-row">
        <div className="contest-search-wrap">
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
        </div>

        {/* 🔹 오른쪽 요일 필터 버튼들 */}
        <div className="contest-day-filter">
          {DAY_BUTTONS.map((d) => (
            <button
              key={d.value}
              type="button"
              className={
                "contest-day-btn" +
                (dayFilter === d.value ? " contest-day-btn-active" : "")
              }
              onClick={() => setDayFilter(d.value)}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="contest-viewport">
        <div className="contest-wrap">
          {filtered.map((r, idx) => (
            <button
              key={idx}
              type="button"
              className="contest-btn"
              onClick={() => handleClickRow(r)}
            >
              <div className="contest-name">{r["경진대회명"]}</div>
              <div className="contest-consortium">{r["컨소시엄명"]}</div>
              {/* 필요하면 일정도 같이 보여줄 수 있음 */}
              {/* <div className="contest-schedule">{r["일정 및 장소"]}</div> */}
            </button>
          ))}

          {filtered.length === 0 && rows.length > 0 && (
            <div className="contest-empty">검색/필터 결과가 없습니다.</div>
          )}

          {rows.length === 0 && !err && (
            <div className="contest-empty">불러온 경진대회가 없습니다.</div>
          )}
        </div>
      </div>
       <div className="scroll-hint-char">
        스크롤을 내려줘!
      </div>
    </main>
  );
}
