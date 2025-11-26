package com.example.coshowsample;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

// Temi SDK imports - SDK가 없을 때를 대비해 주석 처리
import com.example.coshowsample.temi.TemiInterface;
import com.robotemi.sdk.Robot;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private static final int REQ_PERMISSIONS = 1001;
    private static final String ENTRY_URL = "file:///android_asset/public/index.html";

    private WebView webView;
    private Robot robot;
    private TemiInterface temiInterface;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initTemi();

        requestMediaPermissions();
        setupWebView();
    }

    private void initTemi() {
        robot = Robot.getInstance();
        temiInterface = new TemiInterface(robot);
    }

    private void requestMediaPermissions() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return;

        String[] required = new String[]{
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO
        };

        boolean needsRequest = false;
        for (String permission : required) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                needsRequest = true;
                break;
            }
        }

        if (needsRequest) {
            ActivityCompat.requestPermissions(this, required, REQ_PERMISSIONS);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        webView = findViewById(R.id.webview);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);

        webView.addJavascriptInterface(temiInterface, "temi");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                } else {
                    super.onPermissionRequest(request);
                }
            }
            @Override
            public boolean onConsoleMessage(android.webkit.ConsoleMessage consoleMessage) {
                Log.d("WEBVIEW_LOG",
                        consoleMessage.message() + " -- From line "
                                + consoleMessage.lineNumber() + " of "
                                + consoleMessage.sourceId()
                );
                return true;
            }
        });

        LocalServer server = new LocalServer(this, 8080);
        try {
            server.start();
        } catch (IOException e) {
            e.printStackTrace();
        }

// WebView 로드
        webView.loadUrl("https://tellme.kwidea.com/");
    }

    @Override
    protected void onDestroy() {
        
        if (robot != null) {
            robot = null;
        }
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
