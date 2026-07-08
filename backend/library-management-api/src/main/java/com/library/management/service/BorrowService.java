package com.library.management.service;

import com.library.management.dto.request.ApproveRequestRequest;
import com.library.management.dto.request.BorrowRequestCreate;
import com.library.management.dto.request.IssueBookRequest;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.dto.response.PageResponse;

import java.util.List;

public interface BorrowService {
    BorrowResponse issueBook(IssueBookRequest request);
    BorrowResponse returnBook(Long borrowId);
    BorrowResponse renewBook(Long borrowId);
    PageResponse<BorrowResponse> getAllBorrows(int page, int size);
    BorrowResponse getBorrowById(Long id);
    List<BorrowResponse> getOverdueBorrows();
    List<BorrowResponse> getMyBorrows();
    PageResponse<BorrowResponse> getMemberBorrows(Long memberId, int page, int size);
    PageResponse<BorrowResponse> getBookBorrows(Long bookId, int page, int size);

    BorrowResponse requestBook(BorrowRequestCreate request);
    List<BorrowResponse> getPendingRequests();
    BorrowResponse approveRequest(Long requestId, ApproveRequestRequest request);
    BorrowResponse rejectRequest(Long requestId);
    void cancelRequest(Long requestId);
}
