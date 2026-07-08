package com.library.management.dto.request;

import com.library.management.enums.RoleType;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateUserRolesRequest {

    @NotEmpty(message = "At least one role is required")
    private Set<RoleType> roles;
}
