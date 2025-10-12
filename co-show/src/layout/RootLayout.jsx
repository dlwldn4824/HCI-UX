import { Outlet, NavLink } from "react-router-dom";

export default function RootLayout() {
  return (
    <>
      <header style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"16px 20px"
      }}>
        <div style={{ fontWeight: 800 }}>CO-SHOW</div>
        <nav style={{ display:"flex", gap:16 }}>
          {[
            ["홈", "/"],
            ["전시장 안내", "/guide"],
            ["전시 일정", "/schedule"],
            ["이벤트 참여", "/events"],
            ["사진 촬영", "/photo"],
            ["문의", "/inquiry"],
          ].map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                padding:"6px 10px",
                borderRadius:8,
                background: isActive ? "rgba(0,0,0,0.06)" : "transparent",
                fontWeight:600
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
