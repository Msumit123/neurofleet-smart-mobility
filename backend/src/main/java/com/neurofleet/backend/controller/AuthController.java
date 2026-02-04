package com.neurofleet.backend.controller;

import com.neurofleet.backend.dto.JwtResponse;
import com.neurofleet.backend.dto.LoginRequest;
import com.neurofleet.backend.dto.MessageResponse;
import com.neurofleet.backend.dto.SignupRequest;
import com.neurofleet.backend.model.User;
import com.neurofleet.backend.repository.UserRepository;
import com.neurofleet.backend.security.JwtUtils;
import com.neurofleet.backend.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // ========================= SIGN IN =========================
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getName(),
                roles,
                userDetails.getApprovalStatus()));
    }

    // ========================= SIGN UP =========================
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {

        // Check email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Convert role string -> enum safely
        User.Role role;
        try {
            role = User.Role.valueOf(
                    signUpRequest.getRole()
                            .toUpperCase()
                            .replace(" ", "_"));
        } catch (Exception e) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Invalid role provided"));
        }

        // Create new user
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setName(signUpRequest.getName());
        user.setPhone(signUpRequest.getPhone());
        user.setLicenseNumber(signUpRequest.getLicenseNumber());
        user.setRole(role);

        // Approval logic
        if (role == User.Role.DRIVER) {
            user.setApprovalStatus(User.ApprovalStatus.PENDING);
        } else {
            user.setApprovalStatus(User.ApprovalStatus.APPROVED);
        }

        userRepository.save(user);

        return ResponseEntity.ok(
                new MessageResponse("User registered successfully!"));
    }
}
