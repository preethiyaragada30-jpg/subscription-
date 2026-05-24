package com.subscriptionmanager.config;

import com.subscriptionmanager.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Map;

/** Facade over JwtTokenProvider for service layer usage */
@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtTokenProvider jwtTokenProvider;

    public String generateToken(UserDetails userDetails) {
        return jwtTokenProvider.generateToken(userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, String username) {
        return jwtTokenProvider.generateToken(extraClaims, username);
    }

    public String extractUsername(String token) {
        return jwtTokenProvider.extractUsername(token);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        return jwtTokenProvider.isTokenValid(token, userDetails);
    }
}
