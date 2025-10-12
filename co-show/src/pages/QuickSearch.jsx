import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/search.css";

export default function QuickSearch() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  function handleSubmit(e) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim() || "";
    // 간단 동작: /map?q=검색어 로 이동 (나중에 하이라이트/포커스 연동 용이)
    nav(q ? `/map?q=${encodeURIComponent(q)}` : "/map");
  }

  // 가끔 /search?q=... 로 들어올 수도 있으니 input 기본값 지원
  const defaultValue = params.get("q") || "";

  return (
    <main className="qs-page">
      {/* 상단: 지도 미리보기 영역 */}
      <section className="qs-hero">
        <div className="qs-hero-card">
          <div className="qs-hero-title">
            전체 지도 → 검색된 장소로 이동
          </div>
          <button
            type="button"
            className="qs-hero-btn"
            onClick={() => nav("/map")}
            aria-label="지도 화면으로 이동"
          >
            지도로 보기
          </button>
        </div>
      </section>

      {/* 하단: 키보드 검색 입력 */}
      <section className="qs-input-wrap">
        <form className="qs-input-card" onSubmit={handleSubmit} aria-label="빠른 부스 검색">
          <label htmlFor="q" className="qs-input-label">키보드 검색</label>
          <input
            id="q"
            name="q"
            type="text"
            placeholder="부스 이름 또는 번호를 입력하세요 (예: A-12, 로봇연구회)"
            defaultValue={defaultValue}
            className="qs-input"
          />
          <div className="qs-actions">
            <button type="submit" className="qs-submit">검색</button>
            <button
              type="button"
              className="qs-clear"
              onClick={(e) => {
                const form = e.currentTarget.closest("form");
                form.querySelector("#q").value = "";
              }}
            >
              지우기
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
