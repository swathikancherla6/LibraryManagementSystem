package com.library.management.mapper;

import com.library.management.dto.response.MemberResponse;
import com.library.management.entity.Member;

public final class MemberMapper {

    private MemberMapper() {}

    public static MemberResponse toResponse(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .email(member.getUser().getEmail())
                .firstName(member.getUser().getFirstName())
                .lastName(member.getUser().getLastName())
                .membershipNumber(member.getMembershipNumber())
                .address(member.getAddress())
                .membershipType(member.getMembershipType())
                .active(member.getActive())
                .joinedDate(member.getJoinedDate())
                .createdAt(member.getCreatedAt())
                .build();
    }
}
