package com.library.management.service.impl;

import com.library.management.dto.request.MemberRequest;
import com.library.management.dto.response.MemberResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.entity.Member;
import com.library.management.entity.User;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.MemberMapper;
import com.library.management.repository.MemberRepository;
import com.library.management.repository.UserRepository;
import com.library.management.service.MemberService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<MemberResponse> getMembers(int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("joinedDate").descending());
        return SecurityUtils.toPageResponse(memberRepository.findAll(pageable).map(MemberMapper::toResponse));
    }

    @Override
    public MemberResponse getMemberById(Long id) {
        return MemberMapper.toResponse(findMember(id));
    }

    @Override
    @Transactional
    public MemberResponse createMember(MemberRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (memberRepository.findByUserId(user.getId()).isPresent()) {
            throw new BadRequestException("Member profile already exists for this user");
        }

        Member member = Member.builder()
                .user(user)
                .membershipNumber("MEM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .address(request.getAddress())
                .membershipType(request.getMembershipType() != null ? request.getMembershipType() : "STANDARD")
                .joinedDate(LocalDate.now())
                .build();

        return MemberMapper.toResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMember(Long id, MemberRequest request) {
        Member member = findMember(id);
        if (request.getAddress() != null) member.setAddress(request.getAddress());
        if (request.getMembershipType() != null) member.setMembershipType(request.getMembershipType());
        return MemberMapper.toResponse(memberRepository.save(member));
    }

    @Override
    @Transactional
    public MemberResponse updateMemberStatus(Long id, boolean active) {
        Member member = findMember(id);
        member.setActive(active);
        member.getUser().setActive(active);
        return MemberMapper.toResponse(memberRepository.save(member));
    }

    private Member findMember(Long id) {
        return memberRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id: " + id));
    }
}
