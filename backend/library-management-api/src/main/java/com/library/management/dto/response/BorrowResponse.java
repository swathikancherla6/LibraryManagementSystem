package com.library.management.dto.response;

import com.library.management.enums.BorrowStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BorrowResponse {
    private Long id;
    private Long memberId;
    private String memberName;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private LocalDate issueDate;
    private LocalDate dueDate;
    private LocalDate returnDate;
    private BorrowStatus status;
    private Integer renewalCount;
    private LocalDateTime createdAt;
}
