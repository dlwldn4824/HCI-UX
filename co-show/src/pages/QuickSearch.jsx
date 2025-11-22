// src/pages/QuickSearch.jsx
import "../styles/search.css";
import { useNavigate } from "react-router-dom";

// 배경 이미지들
import bgAll from "../assets/빠른길찾기/A존 보기 클릭 시.png";
import bgAIDrone from "../assets/전시회장 사진/AI 드로잉 로봇 및 오목 로봇 체험.png";
import bgRoboShow from "../assets/전시회장 사진/ROBO SHOW(4족보행 로봇 및 테미 체험).png";
import bgRace from "../assets/전시회장 사진/일반인 로봇 교육 프로그램 1(경주로봇 만들기).png";
import bgCleaner from "../assets/전시회장 사진/일반인 로봇 교육 프로그램2(청소로봇 만들기).png";
import bgGyro from "../assets/전시회장 사진/일반인 교육 프로그램3(자이로 외발주행 로봇 만들기).png";
import bgSpider from "../assets/전시회장 사진/일반인 로봇 교육 프로그램4(유선 스파이더로봇 만들기).png";
import bgHumanoid from "../assets/전시회장 사진/일반인 로봇 교육프로그램5(휴머노이드 이론교육 및 미션수행).png";

const PROGRAMS = [
  {
    id: "all-zones",
    label: "모든 체험 존 확인하기",
    title: "모든 체험 존 한눈에 보기",
    description:
      "캠퍼스 곳곳에 펼쳐진 모든 체험 존의 위치와 정보를 한 번에 확인해 보세요.",
    ageGroup: null,
    category: "전체",
    duration: null,
    method: null,
    timeRange: "10:00 ~ 18:00",
    bgImage: bgAll,
    zonePath: "/map", // 👉 '그 존 구경 가기' 눌렀을 때 이동할 경로
  },
  {
    id: "ai-drone",
    label: "AI 드론 및 로봇 오목 로봇 체험",
    title: "AI 드론 및 로봇 오목 로봇 체험",
    description:
      "로봇과의 오목두기·로봇이 그려주는 캐리커쳐 체험을 선택하여 진행하는 프로그램입니다.",
    ageGroup: "초등학생 이상",
    category: "지능형 로봇",
    duration: "10분",
    method: "현장접수",
    timeRange: "10:00 ~ 18:00",
    bgImage: bgAIDrone,
    zonePath: "/map",
  },
  {
    id: "robo-show",
    label: "ROBO SHOW",
    title: "ROBO SHOW",
    description:
      "4족 보행로봇·모바일로봇 등을 활용한 로봇쇼를 관람할 수 있는 프로그램입니다.",
    ageGroup: "초등학생 이상",
    category: "지능형 로봇",
    duration: "상시",
    method: "현장접수",
    timeRange: "10:00 ~ 18:00",
    bgImage: bgRoboShow,
    zonePath: "/map",
  },
  {
    id: "race-robot",
    label: "경주로봇 만들기",
    title: "경주로봇 만들기",
    description:
      "경주로봇을 직접 만들어 트랙에서 다른 사람과 경기를 해보는 체험형 프로그램입니다.",
    ageGroup: "초등학생 이상",
    category: "지능형 로봇",
    duration: "60분",
    method: "현장접수",
    timeRange: "11:00 ~ 12:00",
    bgImage: bgRace,
    zonePath: "/map",
  },
  {
    id: "cleaner-robot",
    label: "청소로봇 만들기",
    title: "청소로봇 만들기",
    description:
      "로봇청소기의 원리를 배우고 자율주행청소로봇을 직접 만들어 보는 프로그램입니다.",
    ageGroup: "초등학생 고학년 이상",
    category: "지능형 로봇",
    duration: "60분",
    method: "사전접수",
    timeRange: "12:00 ~ 13:00",
    bgImage: bgCleaner,
    zonePath: "/map",
  },
  {
    id: "gyro-robot",
    label: "자이로 외발주행로봇 만들기",
    title: "자이로 외발주행로봇 만들기",
    description:
      "신기한 자이로 레일카의 원리를 배우고 외발주행로봇을 만들어보는 프로그램입니다.",
    ageGroup: "초등학생 고학년 이상",
    category: "지능형 로봇",
    duration: "60분",
    method: "사전접수",
    timeRange: "13:00 ~ 14:00",
    bgImage: bgGyro,
    zonePath: "/map",
  },
  {
    id: "spider-robot",
    label: "유선 스파이더로봇 만들기",
    title: "유선 스파이더로봇 만들기",
    description:
      "유선으로 조종이 가능한 다족로봇(스파이더 로봇)을 직접 만들어보는 프로그램입니다.",
    ageGroup: "초등학생 고학년 이상",
    category: "지능형 로봇",
    duration: "60분",
    method: "사전접수",
    timeRange: "14:00 ~ 15:00",
    bgImage: bgSpider,
    zonePath: "/map",
  },
  {
    id: "robo-dog",
    label: "로봇아 멍멍해봐",
    title: "로봇아 멍멍해봐",
    description:
      "4족보행로봇의 원리를 학습하고 트랙 운행을 통해 로봇의 움직임을 직접 체험하는 프로그램입니다.",
    ageGroup: "초등학생 고학년 이상",
    category: "지능형 로봇",
    duration: "60분",
    method: "현장접수",
    timeRange: null,
    // CSV에 이미지 경로가 비어 있어서, 일단 같은 존 느낌의 이미지를 임시로 사용
    bgImage: bgRoboShow,
    zonePath: "/map",
  },
  {
    id: "humanoid-mission",
    label: "휴머노이드 이론교육 및 미션수행",
    title: "휴머노이드 이론교육 및 미션수행",
    description:
      "고성능 소형 휴머노이드의 기본 원리 및 제어법을 교육하고, 직접 미션 경기를 수행해 보는 프로그램입니다.",
    ageGroup: "중학생 이상",
    category: "지능형 로봇",
    duration: "90분",
    method: "사전접수",
    timeRange: "15:00 ~ 16:30",
    bgImage: bgHumanoid,
    zonePath: "/map",
  },
];

export default function QuickSearch() {
  const nav = useNavigate();

  const handleClick = (program) => {
    // ⭐ "모든 체험 존 확인하기"만 바로 /map 이동
    if (program.id === "all-zones") {
      nav("/map");
      return;
    }

    // 나머지는 상세 페이지로 state 넘기기
    nav("/quick/view", { state: program });
  };
  return (
    <main className="qs-page">
      <div className="qs-scrollArea">
        <div className="qs-track">
          {PROGRAMS.map((p, index) => (
            <button
              key={p.id}
              className={`qs-btn qs-btn${index + 1}`}
              onClick={() => handleClick(p)}
            >
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
