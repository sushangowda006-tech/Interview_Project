package com.example.interview.controller;

import com.example.interview.entity.Question;
import com.example.interview.repository.QuestionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/questions")
public class AdminQuestionController {

    private final QuestionRepository questionRepository;

    public AdminQuestionController(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    // ✅ ADD QUESTION
    @PostMapping
    public Question addQuestion(@RequestBody Question question) {
        return questionRepository.save(question);
    }

    // ✅ UPDATE QUESTION (FIXED)
    @PutMapping("/{id}")
    public Question updateQuestion(@PathVariable Long id,
                                   @RequestBody Question updatedQuestion) {

        Question q = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // 🔥 FIX HERE
        q.setQuestionTitle(updatedQuestion.getQuestionTitle());
        q.setOptionA(updatedQuestion.getOptionA());
        q.setOptionB(updatedQuestion.getOptionB());
        q.setOptionC(updatedQuestion.getOptionC());
        q.setOptionD(updatedQuestion.getOptionD());
        q.setCorrectAnswer(updatedQuestion.getCorrectAnswer());

        return questionRepository.save(q);
    }

    // ✅ DELETE QUESTION
    @DeleteMapping("/{id}")
    public void deleteQuestion(@PathVariable Long id) {
        questionRepository.deleteById(id);
    }

    // ✅ GET ALL QUESTIONS
    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
}