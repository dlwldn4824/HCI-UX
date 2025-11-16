import "../styles/search.css";

export default function QuickSearch() {
  return (
    <main className="qs-page">
      {/* 🔹 가로 스크롤 담당 영역 */}
      <div className="qs-scrollArea">
        {/* 🔹 3680 x 1200 배경 + 버튼들 */}
        <div className="qs-track">

          <button className="qs-btn qs-btn1"><span>모든 체험 존 확인하기</span></button>
          <button className="qs-btn qs-btn2"><span>AI 드론 및 로봇·오목 로봇 체험</span></button>
          <button className="qs-btn qs-btn3"><span>ROBO SHOW</span></button>
          <button className="qs-btn qs-btn4"><span>경주로봇 만들기</span></button>
          <button className="qs-btn qs-btn5"><span>청소로봇 만들기</span></button>
          <button className="qs-btn qs-btn6"><span>자이로 외발주행로봇 만들기</span></button>
          <button className="qs-btn qs-btn7"><span>유선 스파이더로봇</span></button>
          <button className="qs-btn qs-btn8"><span>로봇아 멍멍해봐</span></button>
          <button className="qs-btn qs-btn9"><span>휴머노이드 이론교육 및 미션수행</span></button>

                  </div>
      </div>
    </main>
  );
}
