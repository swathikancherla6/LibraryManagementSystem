package com.library.management.controller;

import com.library.management.dto.response.*;
import com.library.management.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/member-summary")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<MemberSummaryResponse>> getMemberSummary() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getMemberSummary()));
    }

    @GetMapping("/recent-borrows")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getRecentBorrows() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentBorrows()));
    }

    @GetMapping("/recent-books")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getRecentBooks() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRecentBooks()));
    }

    @GetMapping("/top-borrowed")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<TopBookResponse>>> getTopBorrowed() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getTopBorrowedBooks()));
    }

    @GetMapping("/due-today")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getDueToday() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDueToday()));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<StatisticsResponse>> getStatistics() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStatistics()));
    }
}
