package com.library.management.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IssueBookRequest {

    @NotNull(message = "Member ID is required")
    private Long memberId;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Integer loanDays;
}
