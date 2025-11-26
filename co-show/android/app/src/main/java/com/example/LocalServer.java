package com.example.coshowsample;

import android.content.Context;

import fi.iki.elonen.NanoHTTPD;

import java.io.IOException;
import java.io.InputStream;

public class LocalServer extends NanoHTTPD {

    private Context context;

    public LocalServer(Context context, int port) {
        super(port);
        this.context = context;
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();

        // assets/public 폴더 안 파일 가져오기
        InputStream is;
        try {
            String path = "public" + uri;
            is = context.getAssets().open(path);
        } catch (Exception e) {
            return newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not Found");
        }

        // MIME 타입 지정
        String mime = "text/html";
        if (uri.endsWith(".js")) mime = "application/javascript";
        else if (uri.endsWith(".css")) mime = "text/css";

        int size = 0; // InputStream 크기
        try {
            size = is.available();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return newFixedLengthResponse(Response.Status.OK, mime, is, size);
    }
}
