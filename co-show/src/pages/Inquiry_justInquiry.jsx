import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Inquiry 페이지
 * - 배경과 버튼 이미지는 CSS에서 직접 지정
 * - JSX에서는 위치 및 구조만 정의
 */
export default function Inquiry_justInquiry({ onClickBtn1, onClickBtn2 }) {
  const navigate = useNavigate();

  return (
    <div className="just-inquiry-canvas">
      {/* 첫 번째 버튼 */}
      <button
        className="img-btn btn-1"
        onClick={() => navigate("/inquiry")} // ← 첫 번째 버튼 목적지
      />

      {/* 두 번째 버튼 */}
      <button
        className="img-btn btn-2"
        onClick={() => navigate("/")} // ← 두 번째 버튼 목적지
      />
    </div>
  );
}
