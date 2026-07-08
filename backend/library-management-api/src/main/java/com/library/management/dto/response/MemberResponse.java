package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MemberResponse {
    private Long id;
    private Long userId;
    private String email;
    private String firstName;
    private String lastName;
    private String membershipNumber;
    private String address;
    private String membershipType;
    private Boolean active;
    private LocalDate joinedDate;
    private LocalDateTime createdAt;
}
