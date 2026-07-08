package com.library.management.security;

import com.library.management.repository.MemberRepository;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("memberSecurity")
@RequiredArgsConstructor
public class MemberSecurityHelper {

    private final MemberRepository memberRepository;
    private final SecurityUtils securityUtils;

    public boolean isOwner(Long memberId) {
        return memberRepository.findById(memberId)
                .map(m -> m.getUser().getEmail().equals(securityUtils.getCurrentUserEmail()))
                .orElse(false);
    }
}
