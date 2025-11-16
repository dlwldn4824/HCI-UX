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
    </main>
  );
}
