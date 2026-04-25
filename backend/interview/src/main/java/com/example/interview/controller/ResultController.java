package com.example.interview.controller;

import com.example.interview.dto.SubmitRequest;
import com.example.interview.entity.Result;
import com.example.interview.service.ResultService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // ✅ Submit Test
    @PostMapping("/submit")
    public Result submitTest(@RequestBody SubmitRequest request,
                             HttpServletRequest httpRequest) {
        return resultService.calculateAndSaveResult(request, httpRequest);
    }

    // ❌ OPTIONAL: Remove in production (not secure)
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

    // 🏆 LEADERBOARD (FINAL 🔥)
    @GetMapping("/leaderboard")
    public List<Result> getLeaderboard() {
        return resultService.getLeaderboard();
    }
}