import { useNavigate } from "react-router-dom";
import "../styles/InquiryComplete.css";

export default function EventComplete() {
  const nav = useNavigate();

  return (
    <main className="inquiry-calling">
      <div className="inqury-complete">
          <button className="complete-btn" onClick={() => nav("/inquiry/complete")}></button>
      </div>
    </main>
  );
}