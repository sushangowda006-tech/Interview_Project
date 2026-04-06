package com.example.interview.controller;

import com.example.interview.entity.Result;
import com.example.interview.entity.User;
import com.example.interview.repository.ResultRepository;
import com.example.interview.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;

    public AdminController(UserRepository userRepository,
                           ResultRepository resultRepository) {
        this.userRepository = userRepository;
        this.resultRepository = resultRepository;
    }

    // ✅ All users with their quiz results — used by AdminDashboard
    @GetMapping("/users-with-results")
    public List<Map<String, Object>> getUsersWithResults() {

        List<User> users = userRepository.findAll();
        List<Map<String, Object>> response = new ArrayList<>();

        for (User user : users) {
            List<Result> results = resultRepository.findByUserId(user.getId());

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("id",      user.getId());
            entry.put("name",    user.getName());
            entry.put("email",   user.getEmail());
            entry.put("role",    user.getRole());
            entry.put("results", results);
            response.add(entry);
        }

        return response;
    }
}
