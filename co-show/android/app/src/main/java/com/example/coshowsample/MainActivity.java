package com.example.coshowsample;

import android.os.Bundle;

import com.example.coshowsample.temi.TemiCallPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Temi SDK가 필요하면 아래 주석을 해제하고 sdk-debug.aar 파일을 libs 폴더에 추가하세요
        // import com.example.coshowsample.temi.TemiCallPlugin;
        // registerPlugin(TemiCallPlugin.class);
        registerPlugin(TemiCallPlugin.class);
    }
}

