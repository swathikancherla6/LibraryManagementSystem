package com.library.management.security;

import com.library.management.repository.BorrowRecordRepository;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("borrowSecurity")
@RequiredArgsConstructor
public class BorrowSecurityHelper {

    private final BorrowRecordRepository borrowRecordRepository;
    private final SecurityUtils securityUtils;

    public boolean isOwner(Long borrowId) {
        return borrowRecordRepository
                .findByIdAndMemberUserEmail(borrowId, securityUtils.getCurrentUserEmail())
                .isPresent();
    }
}
