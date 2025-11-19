// Home.jsx
import Hero from "../components/Hero.jsx";
import CardNav from "../components/CardNav.jsx";
import "../styles/Home.css";  // 홈 전용 CSS

export default function Home() {
  return (
    <div className="home-wrapper">
      <CardNav />
    </div>
  );
}
