package com.library.management.mapper;

import com.library.management.dto.response.FineResponse;
import com.library.management.entity.Fine;

public final class FineMapper {

    private FineMapper() {}

    public static FineResponse toResponse(Fine fine) {
        return FineResponse.builder()
                .id(fine.getId())
                .borrowRecordId(fine.getBorrowRecord().getId())
                .memberId(fine.getMember().getId())
                .memberName(fine.getMember().getUser().getFirstName() + " " + fine.getMember().getUser().getLastName())
                .bookTitle(fine.getBorrowRecord().getBook().getTitle())
                .amount(fine.getAmount())
                .daysOverdue(fine.getDaysOverdue())
                .status(fine.getStatus())
                .paidAt(fine.getPaidAt())
                .createdAt(fine.getCreatedAt())
                .build();
    }
}
