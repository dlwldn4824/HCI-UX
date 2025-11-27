// 브라우저 콘솔에서 실행할 API 테스트 코드
// 사용법: 개발자 도구(F12) → Console → 이 코드 붙여넣기

const API_BASE = 'https://tellme-api.kwidea.com';

console.log('🔍 백엔드 API 테스트 시작...\n');

// 1. 서버 상태 확인
console.log('1️⃣ 서버 상태 확인...');
fetch(`${API_BASE}/`)
  .then(res => res.text())
  .then(text => {
    console.log('✅ 서버 응답:', text);
    console.log('');
    
    // 2. 업로드 URL 요청
    console.log('2️⃣ 업로드 URL 요청...');
    return fetch(`${API_BASE}/photo/upload?key=1`);
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.text();
  })
  .then(uploadUrl => {
    console.log('✅ 업로드 URL 획득');
    console.log('   URL (처음 80자):', uploadUrl.substring(0, 80) + '...');
    console.log('');
    
    // 업로드 URL이 유효한지 확인
    if (!uploadUrl.trim() || (!uploadUrl.startsWith('http://') && !uploadUrl.startsWith('https://'))) {
      console.warn('⚠️ 업로드 URL 형식이 올바르지 않을 수 있습니다');
      console.log('   전체 URL:', uploadUrl);
    }
    
    // 3. QR 코드 다운로드
    console.log('3️⃣ QR 코드 다운로드 테스트...');
    return fetch(`${API_BASE}/photo/download?key=1`);
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return res.blob();
  })
  .then(blob => {
    console.log('✅ QR 코드 다운로드 성공');
    console.log('   파일 크기:', blob.size, 'bytes');
    console.log('   MIME 타입:', blob.type);
    console.log('');
    
    // QR 코드 이미지를 페이지에 표시
    const imgUrl = URL.createObjectURL(blob);
    console.log('📸 QR 코드 이미지 URL:', imgUrl);
    
    // 이미지 미리보기 생성
    const preview = document.createElement('div');
    preview.style.cssText = 'position: fixed; top: 10px; right: 10px; background: white; padding: 10px; border: 2px solid #333; z-index: 9999;';
    preview.innerHTML = `
      <h4>QR 코드 미리보기</h4>
      <img src="${imgUrl}" style="max-width: 300px; height: auto;" />
      <p style="font-size: 12px; margin-top: 5px;">파일 크기: ${blob.size} bytes</p>
      <button onclick="this.parentElement.remove()" style="margin-top: 5px;">닫기</button>
    `;
    document.body.appendChild(preview);
    
    // 4. CORS 헤더 확인
    console.log('4️⃣ CORS 헤더 확인...');
    return fetch(`${API_BASE}/photo/upload?key=1`, { method: 'HEAD' });
  })
  .then(res => {
    const corsHeader = res.headers.get('access-control-allow-origin');
    if (corsHeader) {
      console.log('✅ CORS 헤더 발견:', corsHeader);
    } else {
      console.warn('⚠️ CORS 헤더가 설정되지 않았을 수 있습니다');
      console.log('   (프로덕션에서는 문제가 될 수 있음)');
    }
    console.log('');
    console.log('✅ 모든 테스트 완료!');
  })
  .catch(err => {
    console.error('❌ 에러 발생:', err);
    console.error('   메시지:', err.message);
    console.error('   스택:', err.stack);
  });

// 별도로 각 단계를 개별 테스트하려면 아래 함수 사용

window.testPhotoUpload = async () => {
  console.log('📤 업로드 URL 테스트...');
  try {
    const res = await fetch(`${API_BASE}/photo/upload?key=1`);
    const url = await res.text();
    console.log('✅ 업로드 URL:', url.trim());
    return url.trim();
  } catch (err) {
    console.error('❌ 에러:', err);
    throw err;
  }
};

window.testQRDownload = async () => {
  console.log('📥 QR 코드 다운로드 테스트...');
  try {
    const res = await fetch(`${API_BASE}/photo/download?key=1`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    console.log('✅ QR 코드 다운로드 성공:', blob.size, 'bytes');
    
    const imgUrl = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = imgUrl;
    img.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 90vw; max-height: 90vh; z-index: 10000; border: 5px solid #333;';
    img.onclick = () => img.remove();
    document.body.appendChild(img);
    
    return blob;
  } catch (err) {
    console.error('❌ 에러:', err);
    throw err;
  }
};

window.testFullFlow = async () => {
  console.log('🔄 전체 플로우 테스트 (이미지 업로드 → QR 코드 다운로드)...');
  
  // 작은 테스트 이미지 생성 (1x1 픽셀 PNG)
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(0, 0, 1, 1);
  
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
  console.log('📷 테스트 이미지 생성:', blob.size, 'bytes');
  
  try {
    // 1. 업로드 URL 가져오기
    const uploadUrl = await window.testPhotoUpload();
    
    // 2. 이미지 업로드
    console.log('📤 이미지 업로드 중...');
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': 'image/png',
      },
    });
    
    if (!uploadRes.ok) {
      throw new Error(`업로드 실패: HTTP ${uploadRes.status}`);
    }
    console.log('✅ 이미지 업로드 완료');
    
    // 3. QR 코드 다운로드
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
    const qrBlob = await window.testQRDownload();
    
    console.log('✅ 전체 플로우 성공!');
    return { uploadUrl, qrBlob };
  } catch (err) {
    console.error('❌ 전체 플로우 실패:', err);
    throw err;
  }
};

console.log('\n💡 사용 가능한 테스트 함수:');
console.log('   - testPhotoUpload() : 업로드 URL 테스트');
console.log('   - testQRDownload()  : QR 코드 다운로드 테스트');
console.log('   - testFullFlow()    : 전체 플로우 테스트 (이미지 업로드 포함)');
console.log('');

