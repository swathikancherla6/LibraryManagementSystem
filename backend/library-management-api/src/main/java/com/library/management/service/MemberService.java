package com.library.management.service;

import com.library.management.dto.request.MemberRequest;
import com.library.management.dto.response.MemberResponse;
import com.library.management.dto.response.PageResponse;

public interface MemberService {
    PageResponse<MemberResponse> getMembers(int page, int size);
    MemberResponse getMemberById(Long id);
    MemberResponse createMember(MemberRequest request);
    MemberResponse updateMember(Long id, MemberRequest request);
    MemberResponse updateMemberStatus(Long id, boolean active);
}
