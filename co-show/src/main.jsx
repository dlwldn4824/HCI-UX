import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";
import RootLayout from "./layout/RootLayout.jsx";
import App from "./App.jsx";
import Guide from "./pages/Guide.jsx";
import Events from "./pages/Events.jsx";
import Photo from "./pages/Photo.jsx";
import MapPage from "./pages/MapPage.jsx";
import ZoneDetailPage from "./pages/ZoneDetailPage.jsx";
import QuickSearch from "./pages/QuickSearch.jsx";
import RecommendList from "./pages/RecommendList.jsx";
import RecommendDetail from "./pages/RecommendDetail.jsx";
import Schedule from "./pages/Schedule.jsx";
import Inquiry from "./pages/Inquiry.jsx";
import EventComplete from "./pages/EventComplete.jsx";   
import EventPhone from "./pages/EventPhone.jsx";
import EventFinish from "./pages/EventFinish.jsx";
import { HashRouter } from "react-router-dom";
import Quiz from "./pages/Quiz.jsx";
import PhotoStart from "./pages/PhotoStart.jsx";
import TrainNav from "./pages/TrainNav.jsx";
import Inquiry_employee from "./pages/Inquiry_employee";
import Inquiry_justInquiry from "./pages/Inquiry_justInquiry";
import QuizQuestion from "./pages/QuizQuestion.jsx";
import QuizResult from "./pages/QuizResult.jsx";
import QuizWrong from "./pages/QuizWrong.jsx";
import QuizQ1 from "./pages/QuizQ1.jsx";
import Quiz1Result from "./pages/Quiz1Result.jsx";
import Quiz1Wrong from "./pages/Quiz1Wrong.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "guide", element: <Guide /> },
      { path: "schedule", element: <Schedule /> }, // ✅ 전시 일정
      { path: "photo", element: <Photo /> },       // ✅ 사진 찍기(배경만)

      { path: "inquiry", element: <Inquiry /> },   // ✅ 문의하기
      { path: "inquiry/employee", element: <Inquiry_employee /> },   // ✅ 문의하기
      { path: "inquiry/justinquiry", element: <Inquiry_justInquiry/> },   // ✅ 문의하기

      // { path: "map", element: <MapPage /> },
      { path: "map", element: <TrainNav /> }, // 기차모양 데모
      { path: "map/:zone", element: <ZoneDetailPage /> }, // all / a / b / c
      { path: "search", element: <QuickSearch /> }, 
      { path: "recommend", element: <RecommendList /> },          // ✅ 리스트
      { path: "recommend/:id", element: <RecommendDetail /> }, 
      
      { path: "photo/start", element: <PhotoStart /> },

      { path: "quiz", element: <Quiz /> },
      { path: "quiz/:qid", element: <QuizQuestion /> },       // 공용 문제 페이지
      { path: "quiz/:qid/result", element: <QuizResult /> },  // 공용 정답 페이지
      { path: "quiz/:qid/wrong", element: <QuizWrong /> },    // 공용 오답 페이지

      { path: "quiz/events", element: <Events /> },
      { path: "events/complete", element: <EventComplete /> },
      { path: "events/phone", element: <EventPhone /> },
      { path: "events/finish", element: <EventFinish /> },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="app-center">
      <div className="root-fixed" id="app-canvas">
        <RouterProvider router={router} />
      </div>
    </div>
  </React.StrictMode>
);
