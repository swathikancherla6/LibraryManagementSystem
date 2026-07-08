package com.library.management.dto.response;

import com.library.management.enums.FineStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class FineResponse {
    private Long id;
    private Long borrowRecordId;
    private Long memberId;
    private String memberName;
    private String bookTitle;
    private BigDecimal amount;
    private Integer daysOverdue;
    private FineStatus status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
