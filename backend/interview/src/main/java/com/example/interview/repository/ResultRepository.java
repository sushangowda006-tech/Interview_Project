package com.example.interview.repository;

import com.example.interview.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {

    // ✅ Fetch results by userId
    List<Result> findByUserId(Long userId);

    // 🏆 TOP 10 Leaderboard (BEST APPROACH)
    List<Result> findTop10ByOrderByPercentageDesc();
}