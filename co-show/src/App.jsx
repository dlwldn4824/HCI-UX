 // App.jsx
import Hero from "./components/Hero.jsx";
import CardNav from "./components/CardNav.jsx";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <div className="app-container">
        <Hero />
        <CardNav />
      </div>
    </div>
  );
}
