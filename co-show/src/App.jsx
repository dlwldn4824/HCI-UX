import Hero from "./components/Hero.jsx";
import CardNav from "./components/CardNav.jsx";
import "./App.css";
import { useEffect, useRef } from "react";

export default function App() {
  const canvasRef = useRef(null);

  // 화면 크기에 맞게 자동 scale
  useEffect(() => {
    const fit = () => {
      const baseW = 1920;
      const baseH = 1200;

      const w = window.innerWidth;
      const h = window.innerHeight;

      const scale = Math.min(w / baseW, h / baseH);

      if (canvasRef.current) {
        canvasRef.current.style.transform = `scale(${scale})`;
      }
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div className="app-wrapper">
      <div className="app-container" ref={canvasRef}>
        <Hero />
        <CardNav />
      </div>
    </div>
  );
}
