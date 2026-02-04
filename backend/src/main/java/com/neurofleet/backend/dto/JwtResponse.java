package com.neurofleet.backend.dto;

import com.neurofleet.backend.model.User;
import java.util.List;

public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private List<String> roles;
    private String name;
    private User.ApprovalStatus approvalStatus;

    public JwtResponse(String accessToken, Long id, String email, String name, List<String> roles, User.ApprovalStatus approvalStatus) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.name = name;
        this.roles = roles;
        this.approvalStatus = approvalStatus;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User.ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(User.ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}
