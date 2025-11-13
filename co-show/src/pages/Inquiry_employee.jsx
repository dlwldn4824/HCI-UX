import { useNavigate } from "react-router-dom";
import "../styles/Inquiry_employee.css";
import { startTemiCall } from "../lib/temiCall";
import { useState } from "react";

export default function InquiryEmployee() {
  const nav = useNavigate();
  const [calling, setCalling] = useState(false);

  const handleYes = async () => {
    if (calling) return;
    setCalling(true);

    // TODO: 실제 값으로 치환(테미 관리자 콘솔/앱의 사용자명, peer id 등)
    const displayName = "홍길동";
    const peerId = "abc-xyz-123";

    try {
      await startTemiCall({ displayName, peerId });
      nav("/inquiry/call");
    } catch (e) {
      console.error("[TemiCall] failed:", e);
      alert("직원 호출에 실패했어요. 네트워크/권한/플러그인 연결을 확인해주세요.");
      setCalling(false);
    }
  };

  return (
    <main className="employee-wrap">
      <div className="inqury-call">
        <button
          className="call-btn-yes"
          onClick={handleYes}
          disabled={calling}
          aria-busy={calling}
        />
        <button
          className="call-btn-no"
          onClick={() => nav("/")}
          disabled={calling}
        />
      </div>
    </main>
  );
}
