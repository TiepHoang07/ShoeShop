package com.shoe.store.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> debugMe(Authentication authentication) {
        Map<String, Object> debugInfo = new HashMap<>();
        if (authentication == null) {
            debugInfo.put("authenticated", false);
            return ResponseEntity.ok(debugInfo);
        }

        debugInfo.put("authenticated", true);
        debugInfo.put("name", authentication.getName());
        debugInfo.put("authorities", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        
        return ResponseEntity.ok(debugInfo);
    }
}
