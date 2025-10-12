import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "guide", element: <Guide /> },
      { path: "schedule", element: <Schedule /> }, // ✅ 전시 일정
      { path: "photo", element: <Photo /> },       // ✅ 사진 찍기(배경만)
      { path: "inquiry", element: <Inquiry /> },   // ✅ 문의하기
      { path: "map", element: <MapPage /> },
      { path: "map/:zone", element: <ZoneDetailPage /> }, // all / a / b / c
      { path: "search", element: <QuickSearch /> }, 
      { path: "recommend", element: <RecommendList /> },          // ✅ 리스트
      { path: "recommend/:id", element: <RecommendDetail /> }, 
      { path: "events", element: <Events /> },
      { path: "inquiry", element: <Inquiry /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
