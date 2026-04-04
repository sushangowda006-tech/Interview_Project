package com.example.interview.controller;

import com.example.interview.entity.Question;
import com.example.interview.service.QuestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/questions")
public class QuestionController {

    private final QuestionService questionService;

    // Constructor Injection
    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    // Add Question
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionService.saveQuestion(question);
    }

    // Get All Questions
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // Get Questions by Topic
    @GetMapping("/topic/{topic}")
    public List<Question> getByTopic(@PathVariable String topic) {
        return questionService.getQuestionsByTopic(topic);
    }
}