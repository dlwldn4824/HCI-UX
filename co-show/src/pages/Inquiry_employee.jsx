import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Inquiry_employee.css";
import { listTemiContacts, startTemiCall } from "../lib/temiCall";

const DEFAULT_DISPLAY_NAME = "CO-Show Temi";
const TEMI_TELEPRESENCE_CONFIG = (() => {
  const displayName =
    (import.meta.env?.VITE_TEMI_CALL_DISPLAY_NAME || DEFAULT_DISPLAY_NAME).trim();
  const peerId = import.meta.env?.VITE_TEMI_CALL_PEER_ID?.trim() || "";

  return { displayName, peerId };
})();

export default function InquiryEmployee() {
  const nav = useNavigate();
  const [calling, setCalling] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const handleYes = async () => {
    if (calling) return;

    const { displayName, peerId } = TEMI_TELEPRESENCE_CONFIG;

    if (!peerId) {
      alert(
        "Temi Telepresence target is not configured. Please set VITE_TEMI_CALL_PEER_ID."
      );
      return;
    }

    setCalling(true);

    try {
      await startTemiCall({ displayName, peerId });
      nav("/inquiry/call");
    } catch (e) {
      console.error("[TemiCall] failed:", e);
      alert(
        "직원 호출 연결에 실패했습니다. 네트워크, 권한 또는 Telepresence 설정을 확인해주세요."
      );
      setCalling(false);
    }
  };

  const handleListContacts = async () => {
    if (loadingContacts) return;
    setLoadingContacts(true);
    try {
      const contacts = await listTemiContacts();
      if (!contacts || contacts.length === 0) {
        alert("가져온 연락처가 없습니다. (Temi 기기에서 실행 중인지, 계정이 활성화됐는지 확인)");
        return;
      }
      const lines = contacts
        .map(
          (c, idx) =>
            `${idx + 1}. ${c.displayName || "(이름없음)"} - ${c.userId || "N/A"}`
        )
        .join("\n");
      alert(`Temi 연락처 목록\n(사용할 Peer ID = userId)\n\n${lines}`);
    } catch (e) {
      console.error("[TemiCall] getContacts failed:", e);
      alert("연락처를 불러오지 못했습니다. Temi SDK/권한/계정 상태를 확인해주세요.");
    } finally {
      setLoadingContacts(false);
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
        <button
          type="button"
          className="call-btn-debug"
          onClick={handleListContacts}
          disabled={calling || loadingContacts}
          aria-busy={loadingContacts}
          style={{ marginTop: "12px", padding: "10px 16px" }}
        >
          연락처 불러오기 (Peer ID 확인용)
        </button>
      </div>
    </main>
  );
}
