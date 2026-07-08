package com.library.management.service.impl;

import com.library.management.config.AppProperties;
import com.library.management.entity.BorrowRecord;
import com.library.management.entity.Fine;
import com.library.management.enums.BorrowStatus;
import com.library.management.enums.FineStatus;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.FineRepository;
import com.library.management.service.OverdueProcessor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OverdueProcessorImpl implements OverdueProcessor {

    private final BorrowRecordRepository borrowRecordRepository;
    private final FineRepository fineRepository;
    private final AppProperties appProperties;

    @Override
    @Transactional
    public void processOverdueRecords() {
        LocalDate today = LocalDate.now();
        List<BorrowRecord> overdue = borrowRecordRepository.findOverdueRecords(
                List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE), today);
        for (BorrowRecord record : overdue) {
            if (record.getStatus() != BorrowStatus.OVERDUE) {
                record.setStatus(BorrowStatus.OVERDUE);
            }
            createOrUpdateFine(record, today);
        }
        if (!overdue.isEmpty()) {
            borrowRecordRepository.saveAll(overdue);
        }
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
