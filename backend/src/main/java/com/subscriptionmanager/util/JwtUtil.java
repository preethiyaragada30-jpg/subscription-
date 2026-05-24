package com.subscriptionmanager.util;

import org.springframework.http.HttpHeaders;

public final class JwtUtil {

    private JwtUtil() {}

    public static final String BEARER_PREFIX = "Bearer ";

    public static String resolveToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
            return authorizationHeader.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    public static String bearerToken(String token) {
        return BEARER_PREFIX + token;
    }

    public static String authHeaderValue(String token) {
        return bearerToken(token);
    }

    public static String headerName() {
        return HttpHeaders.AUTHORIZATION;
    }
}
