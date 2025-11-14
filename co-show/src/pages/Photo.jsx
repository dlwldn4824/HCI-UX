import "../styles/photo.css";
import { useNavigate } from "react-router-dom";


export default function Photo(){
  const nav = useNavigate();

  return (
    <main className="photo-page">
      <section className="photo-stage" />
      <img
        src={"/assets/quiz/quiz_yes_btn.svg"}
        alt="촬영할래요!"
        className="photo-btn photo-btn-yes"
        onClick={() => nav("/photo/filter")}
      />
      <img
        src={"/assets/quiz/quiz_no_btn.svg"}
        alt="괜찮아요"
        className="photo-btn photo-btn-no"
        onClick={() => nav("/")}
      />
    </main>
  );
}
