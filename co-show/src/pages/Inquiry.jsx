import React from "react";
import "../styles/inquiry.css";

/**
 * Inquiry 페이지
 * - 배경과 버튼 이미지는 CSS에서 직접 지정
 * - JSX에서는 위치 및 구조만 정의
 */
export default function Inquiry({ onClickBtn1, onClickBtn2 }) {
  return (
    <div className="inquiry-canvas">
      <button className="img-btn btn-1" onClick={onClickBtn1} />
      <button className="img-btn btn-2" onClick={onClickBtn2} />
    </div>
  );
}
