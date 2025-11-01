import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Inquiry_employee() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("route-emp");
    document.body.style.background = "none";
    return () => {
      document.body.classList.remove("route-emp");
      document.body.style.background = "";
    };
  }, []);

  return (
    <main className="emp-page">
      <div className="inquiry-employee-canvas">
        {/* 아니요 버튼 */}
        <button
          className="emp-btn emp-btn-no"
          onClick={() => navigate("/inquiry")}
          aria-label="아니요"
        />

        {/* 예 버튼 */}
        <button
          className="emp-btn emp-btn-yes"
          onClick={() => navigate("/")}
          aria-label="예"
        />
      </div>
    </main>
  );
}
