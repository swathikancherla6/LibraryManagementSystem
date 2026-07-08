package com.library.management.service;

import com.library.management.enums.BorrowStatus;
import com.library.management.enums.FineStatus;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import static org.junit.jupiter.api.Assertions.*;

class FineCalculationTest {

    @Test
    void overdueDaysAndAmount() {
        LocalDate dueDate = LocalDate.of(2026, 6, 1);
        LocalDate returnDate = LocalDate.of(2026, 6, 10);
        int daysOverdue = (int) ChronoUnit.DAYS.between(dueDate, returnDate);
        BigDecimal amount = BigDecimal.valueOf(5.00).multiply(BigDecimal.valueOf(daysOverdue));

        assertEquals(9, daysOverdue);
        assertEquals(new BigDecimal("45.00"), amount);
    }

    @Test
    void borrowStatusValues() {
        assertEquals(3, BorrowStatus.values().length);
        assertEquals(3, FineStatus.values().length);
    }
}
