import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/recommendPage.css";

const AGE = ["누구나", "8세 이상", "11세 이상", "14세 이상", "17세 이상"];
const TIME = ["5분", "15분 이하", "30분 이하", "60분 이하", "90분 이하"];
const METHOD = ["현장접수", "사전접수"];

export default function EventComplete() {
  const nav = useNavigate();

  const [age, setAge] = useState(null);
  const [time, setTime] = useState(null);
  const [method, setMethod] = useState(null);

  const toggle = (current, value, setter) => setter(current === value ? null : value);

  const onSearch = () => {
    const filters = { age, time, method };
    const qs = Object.entries(filters)
      .filter(([, v]) => v)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");
    nav(`/recommend${qs ? `?${qs}` : ""}`, { state: filters });
  };

  return (
    <main className="recommend-select-wrap">
      <h1 className="rec-title"></h1>

      {/* 연령 5개 (top: 414) */}
      <section className="rec-row row-age">
        <div className="rec-grid rec-grid-5">
          {AGE.map((v) => (
            <button
              key={v}
              className={`rec-choice ${age === v ? "selected" : ""}`}
              aria-pressed={age === v}
              onClick={() => toggle(age, v, setAge)}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* 시간 5개 (top: 560) */}
      <section className="rec-row row-time">
        <div className="rec-grid rec-grid-5">
          {TIME.map((v) => (
            <button
              key={v}
              className={`rec-choice ${time === v ? "selected" : ""}`}
              aria-pressed={time === v}
              onClick={() => toggle(time, v, setTime)}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* 모집방법 2개 (top: 713) */}
      <section className="rec-row row-method">
        <div className="rec-grid rec-grid-2">
          {METHOD.map((v) => (
            <button
              key={v}
              className={`rec-choice ${method === v ? "selected" : ""}`}
              aria-pressed={method === v}
              onClick={() => toggle(method, v, setMethod)}
            >
              {v}
            </button>
          ))}
        </div>
      </section>

      {/* 액션 2개 (top: 909) */}
      <div className="rec-row row-actions">
        <button className="rec-back" onClick={() => nav(-1)}></button>
        <button className="rec-search" onClick={onSearch}></button>
      </div>
    </main>
  );
}
