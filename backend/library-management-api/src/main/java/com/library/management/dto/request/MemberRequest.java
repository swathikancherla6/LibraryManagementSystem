package com.library.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MemberRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String address;
    private String membershipType;
}
