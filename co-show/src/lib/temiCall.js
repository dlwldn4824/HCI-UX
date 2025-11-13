// TemiCall Capacitor 브리지 (웹/에뮬레이터에서 자동 목업)
import { Capacitor, registerPlugin } from '@capacitor/core';

// 네이티브(안드/ios)에서는 진짜 플러그인, 웹에서는 목업 객체
const NativeTemiCall = Capacitor.isNativePlatform()
  ? registerPlugin('TemiCall')
  : {
      // 웹 개발 중에는 실제 통화 대신 권한 프롬프트만 테스트
      async startTelepresence({ displayName, peerId }) {
        try {
          // 마이크 권한 테스트 (옵션)
          if (navigator?.mediaDevices?.getUserMedia) {
            await navigator.mediaDevices.getUserMedia({ audio: true });
          }
        } catch {}
        console.warn('[TemiCall] Web mock: startTelepresence', { displayName, peerId });
        return { ok: true, mock: true };
      }
    };

export async function startTemiCall({ displayName, peerId }) {
  if (!displayName || !peerId) {
    throw new Error('displayName과 peerId가 필요합니다.');
  }

  // 네이티브에선 TemiCallPlugin.kt의 @PluginMethod 호출
  // (Kotlin 쪽에서 call.resolve()만 하므로 반환값은 사용하지 않아도 됨)
  await NativeTemiCall.startTelepresence({ displayName, peerId });
  return { ok: true };
}
