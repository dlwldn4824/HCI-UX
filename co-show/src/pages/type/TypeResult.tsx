// /pages/type/TypeResult.tsx
import { useLocation, useNavigate } from "react-router-dom";
import "./type.css";
import { answersToKey, RESULT_MAP, TypeAnswers } from "./typeLogic";

export default function TypeResult() {
  const nav = useNavigate();
  const { state } = useLocation() as { state?: TypeAnswers };

  // ✅ 테스트 정보 없을 때 (에러 fallback)
  if (!state || state.q1 === undefined || state.q2 === undefined || state.q3 === undefined) {
    return (
      <main className="type-page">
        <div
          className="type-card"
        >
          <div className="type-result">
            <p>테스트 정보가 없습니다. 처음부터 다시 진행해 주세요.</p>
            <button className="btn-primary" onClick={() => nav("/type/q1")}>
              다시 시작하기
            </button>
          </div>
        </div>
      </main>
    );
  }

  const key = answersToKey(state as { q1: boolean; q2: boolean; q3: boolean });
  const result = RESULT_MAP[key];

  return (
    <main className="type-page type-result">
      <div
        className="type-card"
      >
        <div className="type-result">
          <h2 className="type-result-title">{result.label}</h2>
          <p className="type-result-desc">{result.description}</p>

          <div style={{ marginTop: 80 }}>
            <p style={{ fontSize: 24, marginBottom: 12 }}>이런 존을 추천드려요 👇</p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 22 }}>
              {result.zones.map((z) => (
                <li key={z}>{z}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="type-result-actions">
          <button className="btn-primary" onClick={() => nav("/schedule")}>
            추천 존 확인하러 가기
          </button>
          <button className="btn-secondary" onClick={() => nav("/type/q1")}>
            다시 테스트하기
          </button>
        </div>
      </div>
    </main>
  );
}
