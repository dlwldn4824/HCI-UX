package com.example.coshowsample;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

// Temi SDK imports - SDK가 없을 때를 대비해 주석 처리
// import com.robotemi.sdk.Robot;
// import com.robotemi.sdk.TtsRequest;

public class MainActivity extends AppCompatActivity {

    private static final int REQ_PERMISSIONS = 1001;
    private static final String ENTRY_URL = "file:///android_asset/www/index.html";

    private WebView webView;
    private Object robot; // Robot 타입 대신 Object 사용 (SDK가 없을 때 대비)
    private TemiSocketManager socketManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initTemi();
        initWebSocket();
        requestMediaPermissions();
        setupWebView();
    }

    /**
     * WebSocket 서버 연결 초기화
     */
    private void initWebSocket() {
        socketManager = TemiSocketManager.getInstance();
        
        // 서버 URL 설정 (필요 시 변경)
        // 에뮬레이터: "http://10.0.2.2:4000"
        // 실제 기기: "http://YOUR_SERVER_IP:4000"
        // socketManager.setServerUrl("http://192.168.0.100:4000");
        
        // 서버에 연결
        socketManager.connect();
    }

    private void initTemi() {
        try {
            // 리플렉션을 사용하여 Robot 클래스 로드 시도
            Class<?> robotClass = Class.forName("com.robotemi.sdk.Robot");
            java.lang.reflect.Method getInstanceMethod = robotClass.getMethod("getInstance");
            robot = getInstanceMethod.invoke(null);
            
            // 말하기 기능 (선택적)
            try {
                Class<?> ttsRequestClass = Class.forName("com.robotemi.sdk.TtsRequest");
                java.lang.reflect.Method createMethod = ttsRequestClass.getMethod("create", String.class, boolean.class);
                Object ttsRequest = createMethod.invoke(null, "웹 페이지를 불러오는 중입니다.", false);
                
                java.lang.reflect.Method speakMethod = robotClass.getMethod("speak", ttsRequestClass);
                speakMethod.invoke(robot, ttsRequest);
            } catch (Exception e) {
                // 말하기 실패는 무시
            }
        } catch (ClassNotFoundException e) {
            // Temi SDK가 없으면 무시 (정상적인 상황)
        } catch (Exception ex) {
            // Temi SDK 가 없거나 로봇이 아니어도 앱이 크래시 되지 않도록 방어
        }
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
        // 필요 시 권한 결과 처리 (현재는 단순 패스)
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

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(PermissionRequest request) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    runOnUiThread(() -> request.grant(request.getResources()));
                } else {
                    super.onPermissionRequest(request);
                }
            }
        });

        webView.loadUrl(ENTRY_URL);
    }

    @Override
    protected void onDestroy() {
        // WebSocket 연결 해제
        if (socketManager != null) {
            socketManager.disconnect();
            socketManager = null;
        }
        
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
