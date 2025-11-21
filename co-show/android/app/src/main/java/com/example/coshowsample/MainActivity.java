package com.example.coshowsample;

import android.os.Bundle;

// import com.example.coshowsample.temi.TemiCallPlugin; // TEMI 플러그인 - 일반 앱에서는 불필요
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // registerPlugin(TemiCallPlugin.class); // TEMI 플러그인 등록 비활성화
    }
}
