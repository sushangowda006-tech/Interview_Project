package com.example.interview.controller;

import com.example.interview.dto.LoginDTO;
import com.example.interview.dto.RegisterDTO;
import com.example.interview.dto.UserDTO;
import com.example.interview.entity.User;
import com.example.interview.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService service;

    // ================= AUTH APIs =================

    // ✅ REGISTER
    @PostMapping("/register")
    public User register(@RequestBody RegisterDTO dto) {
        return service.registerUser(dto);
    }

    // ✅ LOGIN
    @PostMapping("/login")
    public User login(@RequestBody LoginDTO dto) {
        return service.loginUser(dto);
    }

    // ================= USER APIs =================

    // ✅ CREATE (optional)
    @PostMapping("/users")
    public User createUser(@RequestBody UserDTO userDTO) {
        return service.saveUser(userDTO);
    }

    // ✅ GET ALL
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    // ✅ GET BY ID
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    // ✅ UPDATE
    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return service.updateUser(id, user);
    }

    // ✅ DELETE
    @DeleteMapping("/users/{id}")
    public String deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return "User deleted successfully!";
    }
}