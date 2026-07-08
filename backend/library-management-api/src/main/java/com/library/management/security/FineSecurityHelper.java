package com.library.management.security;

import com.library.management.repository.FineRepository;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("fineSecurity")
@RequiredArgsConstructor
public class FineSecurityHelper {

    private final FineRepository fineRepository;
    private final SecurityUtils securityUtils;

    public boolean isOwner(Long fineId) {
        return fineRepository
                .findByIdAndMemberUserEmail(fineId, securityUtils.getCurrentUserEmail())
                .isPresent();
    }
}
