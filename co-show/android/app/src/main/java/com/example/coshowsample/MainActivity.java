
package com.example.coshowsample;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin; // 👈 이 import가 꼭 필요합니다!

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 1. TemiCallPlugin (영상통화 기능) 등록 - 기존 코드 유지
        try {
            // 패키지 경로: com.example.coshowsample.temi.TemiCallPlugin
            Class<?> temiCallClass = Class.forName("com.example.coshowsample.temi.TemiCallPlugin");
            registerPlugin((Class<? extends Plugin>) temiCallClass);
        } catch (ClassNotFoundException e) {
            // 파일이 없으면 무시 (앱이 꺼지지 않음)
        }

        // 👇 [새로 추가됨] 2. TemiMovePlugin (이동/춤 기능) 등록
        try {
            // 패키지 경로: com.example.coshowsample.temi.TemiMovePlugin
            Class<?> temiMoveClass = Class.forName("com.example.coshowsample.temi.TemiMovePlugin");
            registerPlugin((Class<? extends Plugin>) temiMoveClass);
        } catch (ClassNotFoundException e) {
            // 파일이 없으면 무시
        }
    }
}