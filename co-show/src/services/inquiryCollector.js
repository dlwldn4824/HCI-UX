function getApiBase() {
  const envBase = import.meta?.env?.VITE_API_BASE_URL;
  if (envBase && String(envBase).trim() !== "") return envBase;

  if (typeof navigator !== "undefined" && /Android/i.test(navigator.userAgent)) {
    return "http://10.0.2.2:4000"; // 에뮬레이터용
  }

  return "http://localhost:4000"; // 웹 개발 환경
}

export async function sendInquiry(message) {
  const payload = {
    message,
    deviceId: "temi-001",
  };

  const res = await fetch(`${getApiBase()}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to submit inquiry (${res.status}) ${text}`);
  }

  return await res.json();
}
