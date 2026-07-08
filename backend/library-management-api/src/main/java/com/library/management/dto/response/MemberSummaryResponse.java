package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberSummaryResponse {
    private long activeBorrows;
    private long overdueBorrows;
    private long pendingFines;
    private long wishlistCount;
}
