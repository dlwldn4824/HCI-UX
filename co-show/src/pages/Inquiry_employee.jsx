import { useNavigate } from "react-router-dom";
import "../styles/Inquiry_employee.css";

export default function EventComplete() {
  const nav = useNavigate();

  return (
    <main className="employee-wrap">
      <div className="inqury-call">
          <button className="call-btn-yes" onClick={() => nav("/inquiry/call")}></button>
          <button className="call-btn-no" onClick={() => nav("/")}></button>
      </div>
    </main>
  );
}
