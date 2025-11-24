package com.example.coshowsample.temi;

import android.os.Handler;
import android.os.Looper;
import android.text.TextUtils;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.robotemi.sdk.Robot;

// 👇 이름: "TemiCall" (영상통화용)
@CapacitorPlugin(name = "TemiCall")
public class TemiCallPlugin extends Plugin {
    
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @PluginMethod
    public void startTelepresence(PluginCall call) {
        String displayName = call.getString("displayName");
        String peerId = call.getString("peerId");
        
        if (TextUtils.isEmpty(peerId)) {
            call.reject("Peer ID required");
            return;
        }

        mainHandler.post(() -> {
            Robot.getInstance().startTelepresence(displayName, peerId);
            call.resolve();
        });
    }
}
