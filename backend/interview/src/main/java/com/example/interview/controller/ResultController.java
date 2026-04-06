package com.example.interview.controller;

import com.example.interview.dto.SubmitRequest;
import com.example.interview.entity.Result;
import com.example.interview.entity.User;
import com.example.interview.repository.ResultRepository;
import com.example.interview.repository.UserRepository;
import com.example.interview.service.ResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService resultService;
    private final ResultRepository resultRepository;
    private final UserRepository userRepository;

    public ResultController(ResultService resultService,
                            ResultRepository resultRepository,
                            UserRepository userRepository) {
        this.resultService = resultService;
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    // ✅ Submit Test
    @PostMapping("/submit")
    public Result submitTest(@RequestBody SubmitRequest request,
                             HttpServletRequest httpRequest) {
        return resultService.calculateAndSaveResult(request, httpRequest);
    }

    // ✅ SAVE QUIZ RESULT (called from frontend after quiz)
    @PostMapping("/save")
    public ResponseEntity<?> saveResult(@RequestBody Result result,
                                        HttpServletRequest httpRequest) {
        String email = (String) httpRequest.getAttribute("userEmail");
        if (email == null) return ResponseEntity.status(401).body("Unauthorized");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        result.setUserId(user.getId());
        result.setEmail(email);
        result.setAttemptDate(java.time.LocalDate.now().toString());
        return ResponseEntity.ok(resultRepository.save(result));
    }

    // ✅ GET ALL RESULTS (Admin)
    @GetMapping
    public List<Result> getAllResults() {
        return resultService.getAllResults();
    }

    // ❌ OLD (optional - not secure)
    @GetMapping("/user/{userId}")
    public List<Result> getUserResults(@PathVariable Long userId) {
        return resultService.getResultsByUserId(userId);
    }

    // ✅ SECURE: Logged-in user's results
    @GetMapping("/my")
    public List<Result> getMyResults(HttpServletRequest request) {
        return resultService.getResultsForLoggedInUser(request);
    }

    // ✅ ADMIN: Get all results with user info
    @GetMapping("/admin/all")
    public List<Result> getAllResultsForAdmin() {
        return resultRepository.findAll();
    }

    // 🏆 LEADERBOARD
    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
        return resultService.getLeaderboard();
    }
}