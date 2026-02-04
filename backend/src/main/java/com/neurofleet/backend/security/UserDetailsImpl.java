package com.neurofleet.backend.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.neurofleet.backend.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String email;
    private String name;
    @JsonIgnore
    private String password;
    private Collection<? extends GrantedAuthority> authorities;
    private User.Role role;
    private User.ApprovalStatus approvalStatus;

    public UserDetailsImpl(Long id, String email, String name, String password,
                           Collection<? extends GrantedAuthority> authorities, User.Role role, User.ApprovalStatus approvalStatus) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.password = password;
        this.authorities = authorities;
        this.role = role;
        this.approvalStatus = approvalStatus;
    }

    public static UserDetailsImpl build(User user) {
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole().name()));

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getPassword(),
                authorities,
                user.getRole(),
                user.getApprovalStatus());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public User.Role getRole() {
        return role;
    }
    
    public User.ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}
