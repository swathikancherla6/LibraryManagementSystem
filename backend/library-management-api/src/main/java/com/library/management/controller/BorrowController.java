package com.library.management.controller;

import com.library.management.dto.request.ApproveRequestRequest;
import com.library.management.dto.request.BorrowRequestCreate;
import com.library.management.dto.request.IssueBookRequest;
import com.library.management.dto.response.ApiResponse;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/borrows")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/issue")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowResponse>> issueBook(@Valid @RequestBody IssueBookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book issued", borrowService.issueBook(request)));
    }

    @PostMapping("/{id}/return")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowResponse>> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Book returned", borrowService.returnBook(id)));
    }

    @PostMapping("/{id}/renew")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN', 'MEMBER')")
    public ResponseEntity<ApiResponse<BorrowResponse>> renewBook(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Book renewed", borrowService.renewBook(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<BorrowResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getAllBorrows(page, size)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN') or @borrowSecurity.isOwner(#id)")
    public ResponseEntity<ApiResponse<BorrowResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getBorrowById(id)));
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getOverdue() {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getOverdueBorrows()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getMyBorrows() {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getMyBorrows()));
    }

    @GetMapping("/member/{memberId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<BorrowResponse>>> getMemberBorrows(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getMemberBorrows(memberId, page, size)));
    }

    @GetMapping("/book/{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<PageResponse<BorrowResponse>>> getBookBorrows(
            @PathVariable Long bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getBookBorrows(bookId, page, size)));
    }

    @PostMapping("/requests")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<ApiResponse<BorrowResponse>> requestBook(@Valid @RequestBody BorrowRequestCreate request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Book requested", borrowService.requestBook(request)));
    }

    @GetMapping("/requests")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<List<BorrowResponse>>> getPendingRequests() {
        return ResponseEntity.ok(ApiResponse.success(borrowService.getPendingRequests()));
    }

    @PostMapping("/requests/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowResponse>> approveRequest(
            @PathVariable Long id, @RequestBody(required = false) ApproveRequestRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Book issued", borrowService.approveRequest(id, request)));
    }

    @PostMapping("/requests/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN')")
    public ResponseEntity<ApiResponse<BorrowResponse>> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Request rejected", borrowService.rejectRequest(id)));
    }

    @DeleteMapping("/requests/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LIBRARIAN') or @borrowSecurity.isOwner(#id)")
    public ResponseEntity<ApiResponse<Void>> cancelRequest(@PathVariable Long id) {
        borrowService.cancelRequest(id);
        return ResponseEntity.ok(ApiResponse.success("Request cancelled", null));
    }
}
