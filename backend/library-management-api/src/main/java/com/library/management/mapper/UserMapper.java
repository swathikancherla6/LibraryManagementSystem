package com.library.management.mapper;

import com.library.management.dto.response.*;
import com.library.management.entity.*;
import com.library.management.enums.RoleType;

import java.util.Set;
import java.util.stream.Collectors;

public final class UserMapper {

    private UserMapper() {}

    public static UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .active(user.getActive())
                .roles(toRoleTypes(user.getRoles()))
                .createdAt(user.getCreatedAt())
                .build();
    }

    public static AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .roles(toRoleTypes(user.getRoles()))
                .build();
    }

    public static Set<RoleType> toRoleTypes(Set<Role> roles) {
        return roles.stream().map(Role::getName).collect(Collectors.toSet());
    }
}
