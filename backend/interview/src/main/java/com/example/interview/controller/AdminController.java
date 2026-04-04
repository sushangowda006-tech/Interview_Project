package com.example.interview.controller;

import com.example.interview.dto.UserResultDTO;
import com.example.interview.entity.User;
import com.example.interview.repository.ResultRepository;
import com.example.interview.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ResultRepository resultRepository;

    public AdminController(UserRepository userRepository, ResultRepository resultRepository) {
        this.userRepository   = userRepository;
        this.resultRepository = resultRepository;
    }

    // Returns every USER (not ADMIN) with their full results list
    @GetMapping("/users-with-results")
    public List<UserResultDTO> getUsersWithResults() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> "USER".equals(u.getRole()))
                .collect(Collectors.toList());

        return users.stream().map(u -> new UserResultDTO(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole(),
                resultRepository.findByUserId(u.getId())
        )).collect(Collectors.toList());
    }
}
