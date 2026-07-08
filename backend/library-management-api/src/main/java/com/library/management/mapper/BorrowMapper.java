package com.library.management.mapper;

import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BorrowRecord;

public final class BorrowMapper {

    private BorrowMapper() {}

    public static BorrowResponse toResponse(BorrowRecord record) {
        return BorrowResponse.builder()
                .id(record.getId())
                .memberId(record.getMember().getId())
                .memberName(record.getMember().getUser().getFirstName() + " " + record.getMember().getUser().getLastName())
                .bookId(record.getBook().getId())
                .bookTitle(record.getBook().getTitle())
                .bookIsbn(record.getBook().getIsbn())
                .issueDate(record.getIssueDate())
                .dueDate(record.getDueDate())
                .returnDate(record.getReturnDate())
                .status(record.getStatus())
                .renewalCount(record.getRenewalCount())
                .createdAt(record.getCreatedAt())
                .build();
    }
}
