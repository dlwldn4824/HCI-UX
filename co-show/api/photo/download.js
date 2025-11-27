// Vercel 서버리스 함수: QR 이미지 다운로드 프록시
// Mixed Content 문제를 해결하기 위해 HTTPS → HTTP 프록시

const QR_SERVER_URL = process.env.QR_SERVER_URL || 'http://44.198.30.193:8080';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET 요청만 허용
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { key } = req.query;
    const targetUrl = `${QR_SERVER_URL}/photo/download?key=${key || '1'}`;

    console.log(`[프록시] QR 이미지 다운로드 요청: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Vercel-Proxy/1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[프록시] 에러: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: 'QR download failed',
        details: errorText 
      });
    }

    // 이미지 데이터 가져오기
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/png';

    console.log(`[프록시] 성공: QR 이미지 다운로드 (${buffer.length} bytes)`);

    // 이미지 반환
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.status(200).send(buffer);
  } catch (error) {
    console.error('[프록시] 예외 발생:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message 
    });
  }
}

