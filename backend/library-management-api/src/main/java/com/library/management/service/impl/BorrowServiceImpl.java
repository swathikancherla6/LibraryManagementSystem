package com.library.management.service.impl;

import com.library.management.config.AppProperties;
import com.library.management.dto.request.ApproveRequestRequest;
import com.library.management.dto.request.BorrowRequestCreate;
import com.library.management.dto.request.IssueBookRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.entity.*;
import com.library.management.enums.BorrowStatus;
import com.library.management.enums.FineStatus;
import com.library.management.enums.RoleType;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.BorrowMapper;
import com.library.management.repository.*;
import com.library.management.service.BorrowService;
import com.library.management.service.OverdueProcessor;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowServiceImpl implements BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final FineRepository fineRepository;
    private final AppProperties appProperties;
    private final SecurityUtils securityUtils;
    private final OverdueProcessor overdueProcessor;

    @Override
    @Transactional
    public BorrowResponse issueBook(IssueBookRequest request) {
        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        if (!member.getActive()) {
            throw new BadRequestException("Member is inactive");
        }

        if (fineRepository.countByMemberIdAndStatus(member.getId(), FineStatus.PENDING) > 0) {
            throw new BadRequestException("Member has pending fines. Pay fines before borrowing.");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        if (!book.getActive()) {
            throw new BadRequestException("Book is inactive and cannot be borrowed");
        }
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copies available");
        }

        List<BorrowStatus> activeStatuses = List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE);
        if (borrowRecordRepository.existsByMemberIdAndBookIdAndStatusIn(
                member.getId(), book.getId(), activeStatuses)) {
            throw new BadRequestException("Member already has an active borrow for this book");
        }

        int loanDays = request.getLoanDays() != null
                ? request.getLoanDays()
                : appProperties.getBorrow().getDefaultLoanDays();

        LocalDate issueDate = LocalDate.now();
        BorrowRecord record = BorrowRecord.builder()
                .member(member)
                .book(book)
                .issueDate(issueDate)
                .dueDate(issueDate.plusDays(loanDays))
                .status(BorrowStatus.ISSUED)
                .build();

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public BorrowResponse requestBook(BorrowRequestCreate request) {
        Member member = memberRepository.findByUserId(securityUtils.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found"));
        if (!member.getActive()) {
            throw new BadRequestException("Member is inactive");
        }

        if (fineRepository.countByMemberIdAndStatus(member.getId(), FineStatus.PENDING) > 0) {
            throw new BadRequestException("Member has pending fines. Pay fines before requesting a book.");
        }

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        if (!book.getActive()) {
            throw new BadRequestException("Book is inactive and cannot be requested");
        }

        List<BorrowStatus> activeStatuses = List.of(BorrowStatus.REQUESTED, BorrowStatus.ISSUED, BorrowStatus.OVERDUE);
        if (borrowRecordRepository.existsByMemberIdAndBookIdAndStatusIn(
                member.getId(), book.getId(), activeStatuses)) {
            throw new BadRequestException("You already have a pending request or active borrow for this book");
        }

        BorrowRecord record = BorrowRecord.builder()
                .member(member)
                .book(book)
                .status(BorrowStatus.REQUESTED)
                .build();

        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowResponse> getPendingRequests() {
        return borrowRecordRepository
                .findByStatusWithDetailsOrderByCreatedAt(BorrowStatus.REQUESTED)
                .stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public BorrowResponse approveRequest(Long requestId, ApproveRequestRequest request) {
        BorrowRecord record = findBorrow(requestId);
        if (record.getStatus() != BorrowStatus.REQUESTED) {
            throw new BadRequestException("Only pending requests can be approved");
        }

        Member member = record.getMember();
        if (!member.getActive()) {
            throw new BadRequestException("Member is inactive");
        }
        if (fineRepository.countByMemberIdAndStatus(member.getId(), FineStatus.PENDING) > 0) {
            throw new BadRequestException("Member has pending fines. Pay fines before issuing.");
        }

        Book book = record.getBook();
        if (!book.getActive()) {
            throw new BadRequestException("Book is inactive and cannot be issued");
        }
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copies available");
        }

        int loanDays = (request != null && request.getLoanDays() != null)
                ? request.getLoanDays()
                : appProperties.getBorrow().getDefaultLoanDays();

        LocalDate issueDate = LocalDate.now();
        record.setIssueDate(issueDate);
        record.setDueDate(issueDate.plusDays(loanDays));
        record.setStatus(BorrowStatus.ISSUED);

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public BorrowResponse rejectRequest(Long requestId) {
        BorrowRecord record = findBorrow(requestId);
        if (record.getStatus() != BorrowStatus.REQUESTED) {
            throw new BadRequestException("Only pending requests can be rejected");
        }
        record.setStatus(BorrowStatus.REJECTED);
        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public void cancelRequest(Long requestId) {
        BorrowRecord record = findBorrowForCurrentUser(requestId);
        if (record.getStatus() != BorrowStatus.REQUESTED) {
            throw new BadRequestException("Only pending requests can be cancelled");
        }
        borrowRecordRepository.delete(record);
    }

    @Override
    @Transactional
    public BorrowResponse returnBook(Long borrowId) {
        BorrowRecord record = findBorrow(borrowId);
        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("Book already returned");
        }

        LocalDate today = LocalDate.now();
        record.setReturnDate(today);
        record.setStatus(BorrowStatus.RETURNED);

        Book book = record.getBook();
        book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        bookRepository.save(book);

        if (today.isAfter(record.getDueDate())) {
            createOrUpdateFine(record, today);
        }

        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional
    public BorrowResponse renewBook(Long borrowId) {
        BorrowRecord record = findBorrowForCurrentUser(borrowId);
        if (record.getStatus() == BorrowStatus.RETURNED) {
            throw new BadRequestException("Cannot renew a returned book");
        }
        if (record.getRenewalCount() >= appProperties.getBorrow().getMaxRenewals()) {
            throw new BadRequestException("Maximum renewals reached (" + appProperties.getBorrow().getMaxRenewals() + ")");
        }

        record.setDueDate(record.getDueDate().plusDays(appProperties.getBorrow().getRenewalDays()));
        record.setRenewalCount(record.getRenewalCount() + 1);
        if (record.getStatus() == BorrowStatus.OVERDUE) {
            record.setStatus(BorrowStatus.ISSUED);
        }

        return BorrowMapper.toResponse(borrowRecordRepository.save(record));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BorrowResponse> getAllBorrows(int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("issueDate").descending());
        return SecurityUtils.toPageResponse(
                borrowRecordRepository.findAllWithDetails(pageable).map(BorrowMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public BorrowResponse getBorrowById(Long id) {
        return BorrowMapper.toResponse(findBorrow(id));
    }

    @Override
    @Transactional
    public List<BorrowResponse> getOverdueBorrows() {
        overdueProcessor.processOverdueRecords();
        return borrowRecordRepository
                .findByStatusInWithDetails(List.of(BorrowStatus.OVERDUE))
                .stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BorrowResponse> getMyBorrows() {
        overdueProcessor.processOverdueRecords();
        Member member = memberRepository.findByUserId(securityUtils.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found"));
        return borrowRecordRepository
                .findByMemberIdAndStatusInWithDetails(member.getId(),
                        List.of(BorrowStatus.REQUESTED, BorrowStatus.ISSUED, BorrowStatus.OVERDUE))
                .stream()
                .map(BorrowMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BorrowResponse> getMemberBorrows(Long memberId, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("issueDate").descending());
        return SecurityUtils.toPageResponse(
                borrowRecordRepository.findByMemberIdWithDetails(memberId, pageable).map(BorrowMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<BorrowResponse> getBookBorrows(Long bookId, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("issueDate").descending());
        return SecurityUtils.toPageResponse(
                borrowRecordRepository.findByBookIdWithDetails(bookId, pageable).map(BorrowMapper::toResponse));
    }

    private BorrowRecord findBorrowForCurrentUser(Long borrowId) {
        var user = securityUtils.getCurrentUser();
        boolean isStaff = user.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleType.ADMIN || r.getName() == RoleType.LIBRARIAN);
        if (isStaff) {
            return findBorrow(borrowId);
        }
        return borrowRecordRepository.findByIdAndMemberUserEmail(borrowId, user.getEmail())
                .orElseThrow(() -> new BadRequestException("You can only renew your own borrows"));
    }

    private BorrowRecord findBorrow(Long id) {
        return borrowRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with id: " + id));
    }

    private void createOrUpdateFine(BorrowRecord record, LocalDate asOfDate) {
        int daysOverdue = (int) ChronoUnit.DAYS.between(record.getDueDate(), asOfDate);
        if (daysOverdue <= 0) return;

        BigDecimal amount = appProperties.getFine().getDailyRate().multiply(BigDecimal.valueOf(daysOverdue));
        Fine fine = fineRepository.findByBorrowRecordId(record.getId()).orElseGet(() ->
                Fine.builder()
                        .borrowRecord(record)
                        .member(record.getMember())
                        .status(FineStatus.PENDING)
                        .build());

        fine.setDaysOverdue(daysOverdue);
        fine.setAmount(amount);
        fineRepository.save(fine);
    }
}
