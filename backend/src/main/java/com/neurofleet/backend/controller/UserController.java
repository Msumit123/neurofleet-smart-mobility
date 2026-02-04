package com.neurofleet.backend.controller;

import com.neurofleet.backend.model.User;
import com.neurofleet.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> approveDriver(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
            userRepository.save(user);
            return ResponseEntity.ok("Driver approved successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> rejectDriver(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setApprovalStatus(User.ApprovalStatus.REJECTED);
            userRepository.save(user);
            return ResponseEntity.ok("Driver rejected");
        }).orElse(ResponseEntity.notFound().build());
    }
}
