import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "../styles/Inquiry_justInquiry.css";

export default function EventComplete() {
  const nav = useNavigate();
  const [text, setText] = useState("");
  const inputRef = useRef(null);

  const handleFocus = () => inputRef.current?.focus();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    console.log("문의 내용:", text);
    nav("/events/phone");
  };

  return (
    <main className="leave-inquiry-wrap">
      {/* 기존 위치 유지 */}
      <div className="leave-inquiry">
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="inquiry-input-box" onClick={handleFocus}>
            {text ? text : "여기를 눌러 문의를 남겨보세요"}
          </div>
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="inquiry-hidden-textarea"
            placeholder="문의 내용을 입력하세요"
          />
          <button type="submit" className="inquiry-send"  onClick={() => nav("/inquiry/complete")}></button>
        </form>
      </div>
    </main>
  );
}
