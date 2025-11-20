import { useLocation, useNavigate } from "react-router-dom";
import "../styles/quickDetail.css";

export default function QuickSearchDetail() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 직접 URL로 들어왔을 때 대비
  if (!state) {
    return (
      <main className="qs-detail-page qs-detail-fallback">
        <p>잘못된 접근입니다. 다시 빠른 검색에서 선택해 주세요.</p>
        <button onClick={() => nav("/quick")}>빠른 검색으로 돌아가기</button>
      </main>
    );
  }

  const { title, description, bgImage, zonePath, label } = state;

  return (
    <main className="qs-detail-page">
    <div className="qs-detail-bg">
        <img src={"src/assets/빠른길찾기/A존 보기 클릭 시.png"} alt={title} className="qs-detail-bg-img" />
    </div>

    <div className="qs-detail-content">
        <div className="qs-detail-badge">선택한 체험</div>
        <h1 className="qs-detail-title">{title}</h1>
        <p className="qs-detail-desc">{description}</p>
    </div>

    {/* 버튼들은 content 바깥으로 이동 */}
    <div className="qs-detail-actions">
        <button className="qs-detail-go-btn" onClick={() => nav("/quick/view/guide")}>
        </button>
        <button className="qs-detail-back-btn" onClick={() => nav(-1)}>
        </button>
    </div>
    </main>

  );
}
