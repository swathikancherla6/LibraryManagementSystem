package com.library.management.service;

import com.library.management.dto.response.FineResponse;
import com.library.management.dto.response.PageResponse;

import java.util.List;

public interface FineService {
    PageResponse<FineResponse> getFines(String status, int page, int size);
    FineResponse getFineById(Long id);
    PageResponse<FineResponse> getMemberFines(Long memberId, int page, int size);
    FineResponse calculateFine(Long fineId);
    FineResponse markAsPaid(Long fineId);
    FineResponse waiveFine(Long fineId);
    List<FineResponse> getMyFines();
}
