package com.library.management.controller;

import com.library.management.dto.response.ApiResponse;
import com.library.management.dto.response.FineResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.service.FineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fines")
@RequiredArgsConstructor
public class FineController {

    private final FineService fineService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<FineResponse>>> getFines(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(fineService.getFines(status, page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN') or @fineSecurity.isOwner(#id)")
    public ResponseEntity<ApiResponse<FineResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(fineService.getFineById(id)));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<FineResponse>>> getMemberFines(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(fineService.getMemberFines(memberId, page, size)));
    }

    @PostMapping("/{id}/calculate")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<FineResponse>> calculate(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fine calculated", fineService.calculateFine(id)));
    }

    @PatchMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<FineResponse>> markPaid(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fine marked as paid", fineService.markAsPaid(id)));
    }

    @PatchMapping("/{id}/waive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FineResponse>> waive(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Fine waived", fineService.waiveFine(id)));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<List<FineResponse>>> getMyFines() {
        return ResponseEntity.ok(ApiResponse.success(fineService.getMyFines()));
    }
}
