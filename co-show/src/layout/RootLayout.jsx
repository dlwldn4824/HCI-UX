import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <div className="top-reveal" />
      <header className="topbar" style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 20px"
      }}>
        <div style={{ fontWeight: 800 ,fontSize: "25px"}}>Temi-Tell-Me</div>
        <nav style={{ display:"flex", gap:50 }}>
          {[
            ["홈", "/"],
            ["전시장 안내", "/guide"],
            ["경진대회 일정", "/schedule"],
            ["이벤트 참여", "/quizIntro"],
            ["현장 줄서기", "/line"],
            ["포토존", "/photo"],
            ["문의", "/inquiry"],
            ["평가 남기기", "/review"],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding:"8px 20px",
                borderRadius:8,
                background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                fontWeight:1600,
                fontSize: "25px",   // ⭐ 네비게이션 글씨 전체 크기
              })}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main><Outlet /></main>
    </>
  );
}
