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
import QuizIntro from "./pages/QuizIntro.jsx";
import TypeStart from "./pages/type/TypeQuestion.tsx";
import Q1 from "./pages/type/Q1";
import Q2Make from "./pages/type/Q2Make";
import Q2Read from "./pages/type/Q2Read";
import TypeResult from "./pages/type/TypeResult";
import QuizQ1 from "./pages/QuizQ1.jsx";
import Quiz1Result from "./pages/Quiz1Result.jsx";
import Quiz1Wrong from "./pages/Quiz1Wrong.jsx";
import TypeQuestion from "./pages/type/TypeQuestion.tsx";

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
      
      { path: "quizIntro", element: <QuizIntro/> },
      { path: "quiz", element: <Quiz /> },
      { path: "quiz/:qid", element: <QuizQuestion /> },       // 공용 문제 페이지
      { path: "quiz/:qid/result", element: <QuizResult /> },  // 공용 정답 페이지
      { path: "quiz/:qid/wrong", element: <QuizWrong /> },    // 공용 오답 페이지

      { path: "type-test", element: <TypeQuestion /> },// 유형 테스트 시작 화면
      { path: "type-test/q1", element: <Q1 /> },//유형 테스트 첫 퀴즈
      { path: "type-test/q2/make", element: < Q2Make/> },//유형 테스트
      { path: "type-test/q2/read", element: <Q2Read /> },//유형 테스트
      { path: "type-test/result/:rid", element: <TypeResult /> },//유형 테스트

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
