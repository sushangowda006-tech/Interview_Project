package com.example.interview.service;

import com.example.interview.dto.SubmitRequest;
import com.example.interview.entity.Question;
import com.example.interview.entity.Result;
import com.example.interview.entity.User;
import com.example.interview.repository.QuestionRepository;
import com.example.interview.repository.ResultRepository;
import com.example.interview.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ResultService {

    private final ResultRepository resultRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;

    public ResultService(ResultRepository resultRepository,
                         QuestionRepository questionRepository,
                         UserRepository userRepository) {
        this.resultRepository = resultRepository;
        this.questionRepository = questionRepository;
        this.userRepository = userRepository;
    }

    // ✅ SUBMIT TEST
    public Result calculateAndSaveResult(SubmitRequest request,
                                         HttpServletRequest httpRequest) {

        int score = 0;
        Map<Long, String> userAnswers = request.getAnswers();

        List<Question> questions = questionRepository.findAll();

        for (Question q : questions) {

            String userAnswer = userAnswers.get(q.getId());
            if (userAnswer == null) continue;

            String userAnswerText = getOptionText(q, userAnswer);
            String correctAnswer = q.getCorrectAnswer();

            if (userAnswerText.equalsIgnoreCase(correctAnswer)) {
                score++;
            }
        }

        int totalQuestions = questions.size();
        double percentage = totalQuestions == 0 ? 0 : (score * 100.0) / totalQuestions;

        // ✅ GET EMAIL FROM JWT
        String email = (String) httpRequest.getAttribute("userEmail");

        if (email == null) {
            throw new RuntimeException("Unauthorized: No user email found");
        }

        // ✅ FIND USER
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ SAVE RESULT
        Result result = new Result();
        result.setUserId(user.getId());
        result.setScore(score);
        result.setTotalQuestions(totalQuestions);
        result.setPercentage(percentage);

        return resultRepository.save(result);
    }

    // ✅ HELPER METHOD
    private String getOptionText(Question q, String optionKey) {
        if (optionKey == null) return "";

        return switch (optionKey.toUpperCase()) {
            case "A" -> q.getOptionA();
            case "B" -> q.getOptionB();
            case "C" -> q.getOptionC();
            case "D" -> q.getOptionD();
            default -> optionKey;
        };
    }

    // ✅ GET ALL RESULTS
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    // ❌ OLD METHOD (optional)
    public List<Result> getResultsByUserId(Long userId) {
        return resultRepository.findByUserId(userId);
    }

    // ✅ SECURE: Logged-in user's results
    public List<Result> getResultsForLoggedInUser(HttpServletRequest request) {

        String email = (String) request.getAttribute("userEmail");

        if (email == null) {
            throw new RuntimeException("Unauthorized: No user email found");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return resultRepository.findByUserId(user.getId());
    }

    // 🏆 LEADERBOARD (FIXED 🔥)
    public List<Result> getLeaderboard() {
        return resultRepository.findTop10ByOrderByPercentageDesc();
    }
}