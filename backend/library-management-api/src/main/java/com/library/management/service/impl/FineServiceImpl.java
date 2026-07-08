package com.library.management.service.impl;

import com.library.management.config.AppProperties;
import com.library.management.dto.response.FineResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.Fine;
import com.library.management.entity.Member;
import com.library.management.enums.FineStatus;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.FineMapper;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.FineRepository;
import com.library.management.repository.MemberRepository;
import com.library.management.service.FineService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FineServiceImpl implements FineService {

    private final FineRepository fineRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final MemberRepository memberRepository;
    private final AppProperties appProperties;
    private final SecurityUtils securityUtils;

    @Override
    public PageResponse<FineResponse> getFines(String status, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending());
        if (status != null && !status.isBlank()) {
            FineStatus fineStatus = FineStatus.valueOf(status.toUpperCase());
            return SecurityUtils.toPageResponse(
                    fineRepository.findByStatus(fineStatus, pageable).map(FineMapper::toResponse));
        }
        return SecurityUtils.toPageResponse(fineRepository.findAll(pageable).map(FineMapper::toResponse));
    }

    @Override
    public FineResponse getFineById(Long id) {
        return FineMapper.toResponse(findFine(id));
    }

    @Override
    public PageResponse<FineResponse> getMemberFines(Long memberId, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("createdAt").descending());
        return SecurityUtils.toPageResponse(
                fineRepository.findByMemberId(memberId, pageable).map(FineMapper::toResponse));
    }

    @Override
    @Transactional
    public FineResponse calculateFine(Long fineId) {
        Fine fine = findFine(fineId);
        BorrowRecord record = fine.getBorrowRecord();
        LocalDate asOf = record.getReturnDate() != null ? record.getReturnDate() : LocalDate.now();
        int daysOverdue = (int) ChronoUnit.DAYS.between(record.getDueDate(), asOf);
        if (daysOverdue > 0) {
            fine.setDaysOverdue(daysOverdue);
            fine.setAmount(appProperties.getFine().getDailyRate().multiply(BigDecimal.valueOf(daysOverdue)));
            fineRepository.save(fine);
        }
        return FineMapper.toResponse(fine);
    }

    @Override
    @Transactional
    public FineResponse markAsPaid(Long fineId) {
        Fine fine = findFine(fineId);
        fine.setStatus(FineStatus.PAID);
        fine.setPaidAt(LocalDateTime.now());
        return FineMapper.toResponse(fineRepository.save(fine));
    }

    @Override
    @Transactional
    public FineResponse waiveFine(Long fineId) {
        Fine fine = findFine(fineId);
        fine.setStatus(FineStatus.WAIVED);
        return FineMapper.toResponse(fineRepository.save(fine));
    }

    @Override
    public List<FineResponse> getMyFines() {
        Member member = memberRepository.findByUserId(securityUtils.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found"));
        return fineRepository.findByMemberId(member.getId(), PageRequest.of(0, 100))
                .map(FineMapper::toResponse)
                .getContent();
    }

    private Fine findFine(Long id) {
        return fineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fine not found with id: " + id));
    }
}
