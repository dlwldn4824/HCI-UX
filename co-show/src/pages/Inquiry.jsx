import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/inquiry.css";

/**
 * Inquiry 페이지
 * - 배경과 버튼 이미지는 CSS에서 직접 지정
 * - JSX에서는 위치 및 구조만 정의
 */
export default function Inquiry() {
  const navigate = useNavigate();

   useEffect(() => {
    document.body.classList.add("inquiry-route");
    return () => document.body.classList.remove("inquiry-route");
  }, []);

  return (
    <div className="inquiry-canvas">
      {/* 직원 호출 버튼 */}
      <button
        className="inquiry-btn btn-employee"
        onClick={() => navigate("/inquiry/employee")} // 직원 호출 페이지로 이동
      />

      {/* 문의만 하기 버튼 */}
      <button
        className="inquiry-btn btn-userinquiry"
        onClick={() => navigate("/inquiry/justinquiry")} // 문의만 하기 페이지로 이동
      />
    </div>
  );
}
