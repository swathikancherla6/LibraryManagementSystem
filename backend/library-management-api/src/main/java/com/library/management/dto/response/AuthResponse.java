package com.library.management.dto.response;

import com.library.management.enums.RoleType;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

@Data
@Builder
public class AuthResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private Set<RoleType> roles;
}
