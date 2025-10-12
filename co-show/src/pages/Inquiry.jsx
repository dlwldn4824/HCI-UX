import "../styles/inquiry.css";

export default function Inquiry(){
  return (
    <main className="inq-page">
      <section className="inq-panel">
        <h2 className="inq-title">어떤 도움을 드릴까요?</h2>
        <div className="inq-grid">
          <button type="button" className="inq-card" onClick={() => alert("직원 호출 요청이 접수되었습니다.")}>
            <div className="inq-card-box" />
            <div className="inq-card-label">직원 호출</div>
          </button>
          <button type="button" className="inq-card" onClick={() => alert("문의 접수가 열렸습니다.")}>
            <div className="inq-card-box" />
            <div className="inq-card-label">문의 접수</div>
          </button>
        </div>
      </section>
    </main>
  );
}
