package com.example.interview.service;

import com.example.interview.dto.LoginDTO;
import com.example.interview.dto.RegisterDTO;
import com.example.interview.dto.UserDTO;
import com.example.interview.entity.User;
import com.example.interview.repository.UserRepository;
import com.example.interview.exception.UserNotFoundException;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final BCryptPasswordEncoder encoder;

    // ✅ Constructor Injection (BEST PRACTICE)
    public UserService(UserRepository repository,
                       BCryptPasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    // ✅ CREATE (OPTIONAL)
    public User saveUser(UserDTO userDTO) {
        User user = new User();
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        return repository.save(user);
    }

    // ✅ REGISTER (ENCRYPT PASSWORD 🔥)
    public User registerUser(RegisterDTO dto) {

        if (repository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // 🔐 BCrypt encryption
        user.setPassword(encoder.encode(dto.getPassword()));

        user.setRole("USER");

        return repository.save(user);
    }

    // ✅ LOGIN (CHECK HASHED PASSWORD)
    public User loginUser(LoginDTO dto) {

        User user = repository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔐 Secure password check
        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // ✅ GET ALL
    public List<User> getAllUsers() {
        return repository.findAll();
    }

    // ✅ GET BY ID
    public User getUserById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));
    }

    // ✅ UPDATE
    public User updateUser(Long id, User userDetails) {
        User user = getUserById(id);

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());

        return repository.save(user);
    }

    // ✅ DELETE
    public void deleteUser(Long id) {
        User user = getUserById(id);
        repository.delete(user);
    }
}