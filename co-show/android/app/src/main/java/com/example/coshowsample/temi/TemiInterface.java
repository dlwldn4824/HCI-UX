
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
}