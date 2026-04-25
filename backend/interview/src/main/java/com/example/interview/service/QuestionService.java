package com.example.interview.service;

import com.example.interview.entity.Question;
import com.example.interview.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    // Constructor Injection
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // Save Question
    public Question saveQuestion(Question question) {
        return questionRepository.save(question);
    }

    // Get All Questions
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}