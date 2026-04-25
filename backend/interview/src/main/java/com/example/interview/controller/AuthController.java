package com.example.interview.controller;

import com.example.interview.dto.LoginRequest;
import com.example.interview.dto.RegisterDTO;
import com.example.interview.entity.User;
import com.example.interview.service.AuthService;
import com.example.interview.service.UserService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthService authService,
                          UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }

    // ✅ REGISTER API (ADDED 🔥)
    @PostMapping("/register")
    public User register(@RequestBody RegisterDTO dto) {
        return userService.registerUser(dto);
    }

    // ✅ LOGIN API (already there)
    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}