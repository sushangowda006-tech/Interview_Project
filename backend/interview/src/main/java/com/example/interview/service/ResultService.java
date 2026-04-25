package com.example.interview.service;

import com.example.interview.dto.SubmitRequest;
import com.example.interview.entity.Result;
import com.example.interview.entity.User;
import com.example.interview.repository.ResultRepository;
import com.example.interview.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final UserRepository userRepository;

    public ResultService(ResultRepository resultRepository,
                         UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.userRepository = userRepository;
    }

    public Result calculateAndSaveResult(SubmitRequest request,
                                         HttpServletRequest httpRequest) {

        String email = (String) httpRequest.getAttribute("userEmail");
        if (email == null) throw new RuntimeException("Unauthorized: No user email found");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Result result = new Result();
        result.setUserId(user.getId());
        result.setTopic(request.getTopic());
        result.setScore(request.getScore());
        result.setTotalQuestions(request.getTotalQuestions());
        result.setPercentage(request.getPercentage());

        return resultRepository.save(result);
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public List<Result> getResultsByUserId(Long userId) {
        return resultRepository.findByUserId(userId);
    }

    public List<Result> getResultsForLoggedInUser(HttpServletRequest request) {
        String email = (String) request.getAttribute("userEmail");
        if (email == null) throw new RuntimeException("Unauthorized: No user email found");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resultRepository.findByUserId(user.getId());
    }

    public List<Result> getLeaderboard() {
        return resultRepository.findTop10ByOrderByPercentageDesc();
    }
}
