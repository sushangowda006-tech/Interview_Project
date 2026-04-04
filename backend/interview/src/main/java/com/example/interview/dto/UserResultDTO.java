package com.example.interview.dto;

import com.example.interview.entity.Result;
import java.util.List;

public class UserResultDTO {

    private Long id;
    private String name;
    private String email;
    private String role;
    private List<Result> results;

    public UserResultDTO(Long id, String name, String email, String role, List<Result> results) {
        this.id      = id;
        this.name    = name;
        this.email   = email;
        this.role    = role;
        this.results = results;
    }

    public Long getId()              { return id; }
    public String getName()          { return name; }
    public String getEmail()         { return email; }
    public String getRole()          { return role; }
    public List<Result> getResults() { return results; }
}
