package com.example.coshowsample;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

// 👇 이 두 개가 import 되어 있어야 함
import com.example.coshowsample.temi.TemiCallPlugin;
import com.example.coshowsample.temi.TemiMovePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // 👇 이 두 줄이 등록되어 있어야 함
        registerPlugin(TemiCallPlugin.class);
        registerPlugin(TemiMovePlugin.class);
    }
}