package com.example.coshowsample;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

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
        // HTTPS 연결 설정
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        // User Agent 설정 (일부 웹사이트에서 필요할 수 있음)
        settings.setUserAgentString(settings.getUserAgentString() + " co-show-app");

        webView.addJavascriptInterface(temiInterface, "temi");

        // WebViewClient 설정: URL 로딩 및 에러 처리
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                Log.d("MainActivity", "URL 로딩 시도: " + url);
                
                // 로컬 개발 서버 URL로 리다이렉트 시도 차단
                if (url.contains("172.30") || url.contains("192.0.0.2") || url.contains(":5173")) {
                    Log.w("MainActivity", "로컬 개발 서버 URL 차단: " + url);
                    // 프로덕션 URL로 강제 리다이렉트
                    view.loadUrl("https://tellme.kwidea.com/");
                    return true;
                }
                
                return false; // 기본 동작 허용
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                String url = request.getUrl().toString();
                Log.e("MainActivity", "WebView 에러: " + error.getErrorCode() + " - " + error.getDescription() + " (URL: " + url + ")");
                
                // 로컬 개발 서버 에러인 경우 프로덕션 URL로 리다이렉트
                if (url.contains("172.30") || url.contains("192.0.0.2") || url.contains(":5173")) {
                    Log.w("MainActivity", "로컬 개발 서버 에러 감지, 프로덕션 URL로 리다이렉트");
                    view.loadUrl("https://tellme.kwidea.com/");
                } else {
                    // 프로덕션 URL 에러인 경우 재시도
                    Log.e("MainActivity", "프로덕션 URL 로드 실패, 재시도합니다: " + url);
                    runOnUiThread(() -> {
                        if (url.equals("https://tellme.kwidea.com/")) {
                            Log.w("MainActivity", "프로덕션 URL 재시도: " + url);
                            view.loadUrl(url);
                        }
                    });
                }
            }

            @Override
            public void onReceivedSslError(WebView view, android.webkit.SslErrorHandler handler, android.net.http.SslError error) {
                Log.e("MainActivity", "SSL 에러 발생: " + error.toString());
                Log.e("MainActivity", "SSL 에러 주요 사유: " + error.getPrimaryError());
                // SSL 에러 상세 로깅
                if (error.getCertificate() != null) {
                    Log.e("MainActivity", "Certificate: " + error.getCertificate().toString());
                }
                // 프로덕션 환경에서는 SSL 에러를 무시하지 않음 (보안상 위험)
                // 하지만 로깅은 계속함
                handler.proceed(); // 임시로 진행 (디버깅용) - 프로덕션에서는 제거 필요
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                Log.d("MainActivity", "페이지 로딩 시작: " + url);
                super.onPageStarted(view, url, favicon);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d("MainActivity", "페이지 로딩 완료: " + url);
                super.onPageFinished(view, url);
                
                // 페이지 로드 후 JavaScript로 페이지 상태 확인
                view.evaluateJavascript(
                    "(function() { " +
                    "  console.log('Page loaded, title: ' + document.title); " +
                    "  console.log('URL: ' + window.location.href); " +
                    "  return document.title; " +
                    "})();",
                    title -> Log.d("MainActivity", "페이지 타이틀: " + title)
                );
            }
        });

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

        // WebView 캐시 클리어 (이전 URL 캐시 제거)
        webView.clearCache(true);
        webView.clearHistory();

        // 프로덕션 URL 로드
        String productionUrl = "https://tellme.kwidea.com/";
        Log.d("MainActivity", "Loading URL: " + productionUrl);
        webView.loadUrl(productionUrl);
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
