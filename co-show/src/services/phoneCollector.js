// 임시 수집 서비스: 로컬스토리지에 저장 후 반환
export async function sendPhone(phone) {
  const entry = { phone, timestamp: new Date().toISOString() };
  const key = "collectedPhones";
  try {
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push(entry);
    localStorage.setItem(key, JSON.stringify(prev));
  } catch (e) {
    console.error("Failed to write phone to localStorage", e);
  }
  return entry;
}

// 백엔드 연결 시 예시
// export async function sendPhone(phone) {
//   const res = await fetch(import.meta.env.VITE_API_BASE + "/phones", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ phone }),
//   });
//   if (!res.ok) throw new Error("Failed to submit phone");
//   return await res.json();
// }

