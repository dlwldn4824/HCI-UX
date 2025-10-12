import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/event-complete.css";

export default function EventComplete() {
  const [digits, setDigits] = useState(Array(11).fill(""));
  const [touched, setTouched] = useState(false);
  const nav = useNavigate();

  const value = digits.join("");               // 숫자만
  const isValid = /^01[016789]\d{7,8}$/.test(value); // 국내 휴대폰 포맷 대략 검증

  function handleChange(i, v) {
    if (!/^\d?$/.test(v)) return;              // 숫자 1글자만
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    setTouched(true);

    // 다음 칸 자동 포커스
    const nextEl = document.querySelector(`[data-idx="${i + 1}"]`);
    if (v && nextEl) nextEl.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    alert("참여가 완료되었습니다. 감사합니다!");
    nav("/"); // 완료 후 홈으로 (원하면 다른 경로로 변경)
  }

  return (
    <main className="done-wrap">
      <section className="done-card">
        <header className="done-head">
          <div className="done-need">수정 필요</div>
          <h2 className="done-title">추첨에 참여하시겠습니까?</h2>
          <p className="done-sub">휴대폰 번호를 입력해 주시기 바랍니다.</p>
        </header>

        <form onSubmit={handleSubmit} className="done-form">
          {/* 010-xxxx-xxxx 형태 박스 */}
          <div className="boxes" aria-label="휴대폰 번호 입력 칸">
            {digits.map((d, i) => (
              <input
                key={i}
                data-idx={i}
                className="box"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            ))}
            {/* 구분선 시각화 */}
            <span className="sep" style={{ left: "calc(9% + 3.6em)" }}>-</span>
            <span className="sep" style={{ left: "calc(50% + 1.6em)" }}>-</span>
          </div>

          {/* 에러 메시지 */}
          {touched && !isValid && (
            <p className="error">올바른 휴대폰 번호(예: 01012345678)를 입력해 주세요.</p>
          )}

          <div className="actions">
            <button
              type="button"
              className="btn-ghost"
              onClick={() => nav("/")}
            >
              괜찮아요
            </button>

            <button
              type="submit"
              className={`btn-done ${isValid ? "is-active" : ""}`}
              disabled={!isValid}
            >
              완료
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
