package com.library.management.service.impl;

import com.library.management.dto.response.*;
import com.library.management.entity.Member;
import com.library.management.enums.BorrowStatus;
import com.library.management.enums.FineStatus;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.BookMapper;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.*;
import com.library.management.service.DashboardService;
import com.library.management.service.OverdueProcessor;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final FineRepository fineRepository;
    private final WishlistRepository wishlistRepository;
    private final OverdueProcessor overdueProcessor;
    private final SecurityUtils securityUtils;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalBooks(bookRepository.countByActiveTrue())
                .totalMembers(memberRepository.countByActiveTrue())
                .borrowedBooks(borrowRecordRepository.countByStatusIn(
                        List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE)))
                .availableBooks(bookRepository.sumAvailableCopies())
                .overdueBooks(borrowRecordRepository.countByStatusIn(List.of(BorrowStatus.OVERDUE)))
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public MemberSummaryResponse getMemberSummary() {
        overdueProcessor.processOverdueRecords();

        Member member = memberRepository.findByUserId(securityUtils.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found"));

        long activeBorrows = borrowRecordRepository.countByMemberIdAndStatusIn(
                member.getId(), List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE));
        long overdueBorrows = borrowRecordRepository.countByMemberIdAndStatusIn(
                member.getId(), List.of(BorrowStatus.OVERDUE));
        long pendingFines = fineRepository.countByMemberIdAndStatus(member.getId(), FineStatus.PENDING);
        long wishlistCount = wishlistRepository.findByMemberIdOrderByAddedAtDesc(member.getId()).size();

        return MemberSummaryResponse.builder()
                .activeBorrows(activeBorrows)
                .overdueBorrows(overdueBorrows)
                .pendingFines(pendingFines)
                .wishlistCount(wishlistCount)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowResponse> getRecentBorrows() {
        return borrowRecordRepository
                .findTop10WithDetails(PageRequest.of(0, 10))
                .stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookResponse> getRecentBooks() {
        return bookRepository.findTop10ByActiveTrueOrderByCreatedAtDesc().stream()
                .map(BookMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopBookResponse> getTopBorrowedBooks() {
        return borrowRecordRepository.findTopBorrowedBooks(PageRequest.of(0, 5)).stream()
                .map(row -> TopBookResponse.builder()
                        .bookId((Long) row[0])
                        .title((String) row[1])
                        .author((String) row[2])
                        .borrowCount((Long) row[3])
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowResponse> getDueToday() {
        LocalDate today = LocalDate.now();
        return borrowRecordRepository
                .findByDueDateAndStatusIn(today, List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE))
                .stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public StatisticsResponse getStatistics() {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(5).withDayOfMonth(1);

        List<ChartDataPoint> booksByCategory = bookRepository.countBooksByCategory().stream()
                .map(row -> ChartDataPoint.builder()
                        .label((String) row[0])
                        .value((Long) row[1])
                        .build())
                .toList();

        Map<String, Long> borrowsByMonth = borrowRecordRepository.countBorrowsByMonth(sixMonthsAgo).stream()
                .collect(Collectors.toMap(row -> (String) row[0], row -> (Long) row[1]));
        Map<String, Long> returnsByMonth = borrowRecordRepository.countReturnsByMonth(sixMonthsAgo).stream()
                .collect(Collectors.toMap(row -> (String) row[0], row -> (Long) row[1]));

        List<ChartDataPoint> monthlyBorrowTrends = lastSixMonths().stream()
                .map(month -> ChartDataPoint.builder()
                        .label(month)
                        .value(borrowsByMonth.getOrDefault(month, 0L))
                        .build())
                .toList();

        List<ChartDataPoint> borrowVsReturn = lastSixMonths().stream()
                .flatMap(month -> List.of(
                        ChartDataPoint.builder().label(month + " Borrow").value(borrowsByMonth.getOrDefault(month, 0L)).build(),
                        ChartDataPoint.builder().label(month + " Return").value(returnsByMonth.getOrDefault(month, 0L)).build()
                ).stream())
                .toList();

        Map<String, Long> membersByMonth = memberRepository.countMembersByMonth(sixMonthsAgo).stream()
                .collect(Collectors.toMap(row -> (String) row[0], row -> (Long) row[1]));

        List<ChartDataPoint> memberGrowth = lastSixMonths().stream()
                .map(month -> ChartDataPoint.builder()
                        .label(month)
                        .value(membersByMonth.getOrDefault(month, 0L))
                        .build())
                .toList();

        return StatisticsResponse.builder()
                .booksByCategory(booksByCategory)
                .monthlyBorrowTrends(monthlyBorrowTrends)
                .memberGrowth(memberGrowth)
                .borrowVsReturn(borrowVsReturn)
                .build();
    }

    private List<String> lastSixMonths() {
        YearMonth current = YearMonth.now();
        return IntStream.rangeClosed(0, 5)
                .mapToObj(i -> current.minusMonths(5 - i).toString())
                .toList();
    }
}
