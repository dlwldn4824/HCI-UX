import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import RootLayout from "./layout/RootLayout.jsx";
import App from "./App.jsx";
import Guide from "./pages/Guide.jsx";
import Events from "./pages/Events.jsx";
import Photo from "./pages/Photo.jsx";
import ZoneDetailPage from "./pages/ZoneDetailPage.jsx";
import QuickSearch from "./pages/QuickSearch.jsx";
import RecommendList from "./pages/RecommendList.jsx";
import RecommendDetail from "./pages/RecommendDetail.jsx";
import Schedule from "./pages/Schedule.jsx";
import ScheduleDetail from "./pages/ScheduleDetail.jsx";
import Inquiry from "./pages/Inquiry.jsx";
import EventComplete from "./pages/EventComplete.jsx";   
import EventPhone from "./pages/EventPhone.jsx";
import EventFinish from "./pages/EventFinish.jsx";
import Quiz from "./pages/Quiz.jsx";
import PhotoStart from "./pages/PhotoStart.jsx";
import PhotoFilter from "./pages/PhotoFilter.jsx";
import PhotoQr from "./pages/PhotoQr.jsx";   // ⬅ 추가됨
import TrainNav from "./pages/TrainNav.jsx";
import Inquiry_employee from "./pages/Inquiry_employee";
import Inquiry_justInquiry from "./pages/Inquiry_justInquiry";
import Inquiry_complete from "./pages/InquiryComplete.jsx"
import Inquiry_call from "./pages/Inquiry_call.jsx";
import QuizQuestion from "./pages/QuizQuestion.jsx";
import QuizResult from "./pages/QuizResult.jsx";
import QuizWrong from "./pages/QuizWrong.jsx";
import QuizIntro from "./pages/QuizIntro.jsx";
import Q1 from "./pages/type/Q1";
import Q2 from "./pages/type/Q2";
import Q3 from "./pages/type/Q3";
import TypeResult from "./pages/type/TypeResult";
import TypeTest from "./pages/TypeTest.jsx";
import QuizCorrect from "./pages/QuizCorrect.jsx";
import Recommend from "./pages/RecommendPage.jsx";

import RouteDemo from "./pages/RouteDemo.jsx";

const DESIGN_WIDTH = 1900;
const DESIGN_HEIGHT = 1200;

const getViewportSize = () => {
  if (typeof window === "undefined") {
    return { width: DESIGN_WIDTH, height: DESIGN_HEIGHT };
  }

  const viewport = window.visualViewport ?? window;

  return {
    width: viewport.width ?? window.innerWidth,
    height: viewport.height ?? window.innerHeight,
  };
};

const calcScale = (width, height) => {
  const widthRatio = width / DESIGN_WIDTH;
  const heightRatio = height / DESIGN_HEIGHT;
  const nextScale = Math.min(widthRatio, heightRatio);

  return Number.isFinite(nextScale) && nextScale > 0 ? nextScale : 1;
};

const useViewportScale = () => {
  const [scale, setScale] = useState(() => {
    const { width, height } = getViewportSize();
    return calcScale(width, height);
  });

  useEffect(() => {
    const handleResize = () => {
      const { width, height } = getViewportSize();
      setScale(calcScale(width, height));
    };

    const visualViewport = typeof window !== "undefined" ? window.visualViewport : null;

    handleResize();
    window.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("resize", handleResize);
    visualViewport?.addEventListener("scroll", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("resize", handleResize);
      visualViewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  return scale;
};

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },

      { path: "guide", element: <Guide /> },
      { path: "schedule", element: <Schedule /> },
      { path: "schedule/detail", element: <ScheduleDetail /> },

      { path: "photo", element: <Photo /> },
      { path: "photo/start", element: <PhotoStart /> },
      { path: "photo/filter", element: <PhotoFilter /> },
      { path: "photo/qr", element: <PhotoQr /> },

      { path: "inquiry", element: <Inquiry /> },
      { path: "inquiry/employee", element: <Inquiry_employee /> },
      { path: "inquiry/justinquiry", element: <Inquiry_justInquiry /> },
      { path: "inquiry/complete", element: <Inquiry_complete /> },
      { path: "inquiry/call", element: <Inquiry_call /> },

      { path: "map", element: <TrainNav /> },
      { path: "map/:zone", element: <ZoneDetailPage /> },

      { path: "search", element: <QuickSearch /> },

      { path: "recommend", element: <Recommend /> },
      { path: "recommend/result", element: <RecommendList /> },
      { path: "recommend/:id", element: <RecommendDetail /> },

      { path: "quizIntro", element: <QuizIntro /> },
      { path: "quiz", element: <Quiz /> },
      { path: "quiz/:qid", element: <QuizQuestion /> },
      { path: "quiz/:qid/result", element: <QuizResult /> },
      { path: "quiz/:qid/correct", element: <QuizCorrect /> },
      { path: "quiz/:qid/wrong", element: <QuizWrong /> },

      { path: "type-test", element: <TypeTest /> },
      { path: "type/q1", element: <Q1 /> },
      { path: "type/q2", element: <Q2 /> },
      { path: "type/q3", element: <Q3 /> },
      { path: "type/result", element: <TypeResult /> },

      { path: "quiz/events", element: <Events /> },
      { path: "events/complete", element: <EventComplete /> },
      { path: "events/phone", element: <EventPhone /> },
      { path: "events/finish", element: <EventFinish /> },

      { path: "route-demo", element: <RouteDemo /> },
    ],
  },
]);

function ViewportCanvas() {
  const scale = useViewportScale();

  const canvasStyle = useMemo(
    () => ({
      width: `${DESIGN_WIDTH}px`,
      height: `${DESIGN_HEIGHT}px`,
      transform: `scale(${scale})`,
    }),
    [scale]
  );

  return (
    <div className="app-center">
      <div className="root-fixed" id="app-canvas" style={canvasStyle}>
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ViewportCanvas />
  </React.StrictMode>
);
