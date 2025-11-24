package com.example.coshowsample.temi; // 패키지명 유지

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.robotemi.sdk.Robot;

// 👇 리액트에서 "TemiMove"라고 부를 새 플러그인
@CapacitorPlugin(name = "TemiMove")
public class TemiMovePlugin extends Plugin {

    // [기능 1] 이동하기
    @PluginMethod
    public void goTo(PluginCall call) {
        String locationName = call.getString("location");

        if (locationName == null || locationName.isEmpty()) {
            call.reject("장소 이름이 없습니다.");
            return;
        }

        try {
            Robot.getInstance().goTo(locationName);
            call.resolve();
        } catch (Exception e) {
            call.reject("이동 실패: " + e.getMessage());
        }
    }

    // [기능 2] 춤추기 (360도 회전)
    @PluginMethod
    public void dance(PluginCall call) {
        try {
            Robot.getInstance().turnBy(360, 1.0f);
            call.resolve();
        } catch (Exception e) {
            call.reject("춤추기 실패: " + e.getMessage());
        }
    }
}