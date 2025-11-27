
package com.example.coshowsample.temi;

import android.util.Log;
import android.webkit.JavascriptInterface;

import com.robotemi.sdk.Robot;
import com.robotemi.sdk.TtsRequest;

public class TemiInterface {

    private final Robot robot;

    /**
     * Robot 객체를 받아서 TemiInterface를 생성합니다.
     * @param robot Temi Robot 인스턴스
     */
    public TemiInterface(Robot robot) {
        this.robot = robot; // 전달받은 Robot 객체 사용
        Log.d("TemiInterface", "TemiInterface initialized with Robot instance");
    }

    @JavascriptInterface
    public void goTo(String location) {
        Log.d("TemiInterface", "goTo called with: " + location);
        if (robot != null) {
            robot.goTo(location);
        } else {
            Log.e("TemiInterface", "Robot instance is null");
        }
    }

    @JavascriptInterface
    public void speak(String content) {
        Log.d("TemiInterface", "temi speak with:" + content);

        if (robot != null) {
            TtsRequest request = TtsRequest.create(
                    content,                     // 말할 내용
                    true,                        // isShowOnConversationLayer
                    TtsRequest.Language.KO_KR    // 언어 (한국어)
            );

            robot.speak(request);
        } else {
            Log.e("TemiInterface", "Robot instance is null");
        }
    }

    /**
     * 간단한 춤 동작을 실행합니다.
     * 자바스크립트에서 window.temi.dance() 로 호출 가능합니다.
     */
    @JavascriptInterface
    public void dance() {
        Log.d("TemiInterface", "dance called");
        if (robot != null) {
            // 춤 동작은 시간이 걸리므로 별도 스레드에서 실행하는 것이 좋습니다.
            new Thread(() -> {
                try {
                    // 1. 신나게 말하기
                    // TtsRequest request = TtsRequest.create("춤을 춰볼까요!", false);
                    // robot.speak(request);
                    
                    // 2. 왼쪽으로 360도 회전
                    robot.turnBy(350, 1.0f);
                    Thread.sleep(2000); // 회전 시간 대기

                    // 3. 고개 끄덕이기 (리듬)
                    robot.tiltAngle(20, 1.0f);
                    Thread.sleep(500);
                    robot.tiltAngle(-10, 1.0f);
                    Thread.sleep(500);
                    robot.tiltAngle(20, 1.0f);
                    Thread.sleep(500);
                    
                    // 4. 제자리 뱅글뱅글 (SkidJoy)
                    // linearVelocity(전진): 0, angularVelocity(회전): 1.0 (최대 속도)
                    long startTime = System.currentTimeMillis();
                    while (System.currentTimeMillis() - startTime < 3000) { // 3초 동안
                        robot.skidJoy(0.0f, 1.0f);
                        Thread.sleep(100); // 명령 주기적 전송 필요
                    }
                    robot.stopMovement(); // 멈춤

                    // 5. 마무리 인사
                    robot.tiltAngle(0, 1.0f); // 고개 정면
                    // robot.speak(TtsRequest.create("어때요, 잘하죠?", false));
                } catch (InterruptedException e) {
                    Log.e("TemiInterface", "Dance interrupted", e);
                }
            }).start();
        } else {
            Log.e("TemiInterface", "Robot instance is null");
        }
    }
}