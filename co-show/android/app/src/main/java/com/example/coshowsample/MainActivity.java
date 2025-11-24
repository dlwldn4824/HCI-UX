package com.example.coshowsample;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Temi SDK가 필요하면 아래 주석을 해제하고 sdk-debug.aar 파일을 libs 폴더에 추가하세요
        // import com.example.coshowsample.temi.TemiCallPlugin;
        // registerPlugin(TemiCallPlugin.class);
        
        // SDK가 없으면 TemiCallPlugin 등록 건너뜀
        try {
            Class<?> temiPluginClass = Class.forName("com.example.coshowsample.temi.TemiCallPlugin");
            @SuppressWarnings("unchecked")
            Class<? extends Plugin> pluginClass = (Class<? extends Plugin>) temiPluginClass;
            registerPlugin(pluginClass);
        } catch (ClassNotFoundException e) {
            // Temi SDK가 없으면 무시
        }
    }
}

