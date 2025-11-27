// Vercel 서버리스 함수: 이미지 업로드 PUT 요청 프록시
// Mixed Content 문제를 해결하기 위해 HTTPS → HTTP 프록시
//
// 사용법:
// PUT /api/photo/upload-put?url=<인코딩된_업로드_URL>
// Body: 이미지 바이너리 데이터

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // PUT 요청만 허용
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'Upload URL is required' });
    }

    // URL 디코딩
    const targetUrl = decodeURIComponent(url);
    console.log(`[프록시] 이미지 업로드 PUT 요청: ${targetUrl}`);

    // Vercel 서버리스 함수에서 요청 본문 읽기
    // req는 ReadableStream이므로 스트림에서 직접 읽어야 함
    const chunks = [];
    
    // Node.js 18+ 환경에서 req는 ReadableStream
    if (req.body) {
      // 이미 버퍼나 문자열로 파싱된 경우
      if (Buffer.isBuffer(req.body)) {
        chunks.push(req.body);
      } else if (typeof req.body === 'string') {
        chunks.push(Buffer.from(req.body, 'binary'));
      } else {
        // 스트림 처리
        for await (const chunk of req.body) {
          chunks.push(Buffer.from(chunk));
        }
      }
    } else {
      // req.body가 없는 경우 스트림에서 읽기
      req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      await new Promise((resolve, reject) => {
        req.on('end', resolve);
        req.on('error', reject);
      });
    }

    const buffer = Buffer.concat(chunks);
    console.log(`[프록시] 본문 크기: ${buffer.length} bytes`);

    // HTTP 서버로 프록시
    const response = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': req.headers['content-type'] || 'image/png',
        'Content-Length': buffer.length.toString(),
        'User-Agent': 'Vercel-Proxy/1.0',
      },
      body: buffer,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[프록시] 업로드 에러: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: 'Image upload failed',
        details: errorText 
      });
    }

    const responseText = await response.text().catch(() => '');
    console.log(`[프록시] 업로드 성공: ${response.status}`);

    res.status(response.status).send(responseText || 'Upload successful');
  } catch (error) {
    console.error('[프록시] 예외 발생:', error);
    res.status(500).json({ 
      error: 'Proxy error',
      message: error.message 
    });
  }
}

