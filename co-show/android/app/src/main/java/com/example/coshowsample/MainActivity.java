package com.example.coshowsample;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
// 👇 import 추가
import com.example.coshowsample.temi.TemiCallPlugin;
import com.example.coshowsample.temi.TemiMovePlugin; 

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 👇 두 개 다 등록!
        registerPlugin(TemiCallPlugin.class); // (기존 영상통화용)
        registerPlugin(TemiMovePlugin.class); // (새로 만든 이동/춤용)
    }
}