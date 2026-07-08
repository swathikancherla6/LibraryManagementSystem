package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalBooks;
    private long totalMembers;
    private long borrowedBooks;
    private long availableBooks;
    private long overdueBooks;
}
