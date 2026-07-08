package com.library.management.service;

import com.library.management.dto.response.*;

import java.util.List;

public interface DashboardService {
    DashboardStatsResponse getStats();
    MemberSummaryResponse getMemberSummary();
    List<BorrowResponse> getRecentBorrows();
    List<BookResponse> getRecentBooks();
    List<TopBookResponse> getTopBorrowedBooks();
    List<BorrowResponse> getDueToday();
    StatisticsResponse getStatistics();
}
