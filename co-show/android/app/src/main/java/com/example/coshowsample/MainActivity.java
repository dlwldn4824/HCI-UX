package com.example.coshowsample;

import android.os.Bundle;

import com.example.coshowsample.temi.TemiCallPlugin;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(TemiCallPlugin.class);
    }
}
