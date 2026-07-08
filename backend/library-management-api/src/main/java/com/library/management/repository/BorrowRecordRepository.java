package com.library.management.repository;

import com.library.management.entity.BorrowRecord;
import com.library.management.enums.BorrowStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {

    List<BorrowRecord> findByMemberIdAndStatusIn(Long memberId, List<BorrowStatus> statuses);

    Page<BorrowRecord> findByStatus(BorrowStatus status, Pageable pageable);

    Page<BorrowRecord> findByMemberId(Long memberId, Pageable pageable);

    @Query("SELECT b FROM BorrowRecord b WHERE b.status IN :statuses AND b.dueDate < :today")
    List<BorrowRecord> findOverdueRecords(
            @Param("statuses") List<BorrowStatus> statuses,
            @Param("today") LocalDate today);

    boolean existsByMemberIdAndBookIdAndStatusIn(Long memberId, Long bookId, List<BorrowStatus> statuses);

    boolean existsByBookIdAndStatusIn(Long bookId, List<BorrowStatus> statuses);

    long countByStatusIn(List<BorrowStatus> statuses);

    List<BorrowRecord> findTop10ByOrderByCreatedAtDesc();

    @Query("SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book ORDER BY b.createdAt DESC")
    List<BorrowRecord> findTop10WithDetails(org.springframework.data.domain.Pageable pageable);

    @Query(value = "SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book",
            countQuery = "SELECT count(b) FROM BorrowRecord b")
    Page<BorrowRecord> findAllWithDetails(Pageable pageable);

    @Query(value = "SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book WHERE b.member.id = :memberId",
            countQuery = "SELECT count(b) FROM BorrowRecord b WHERE b.member.id = :memberId")
    Page<BorrowRecord> findByMemberIdWithDetails(@Param("memberId") Long memberId, Pageable pageable);

    @Query(value = "SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book WHERE b.book.id = :bookId",
            countQuery = "SELECT count(b) FROM BorrowRecord b WHERE b.book.id = :bookId")
    Page<BorrowRecord> findByBookIdWithDetails(@Param("bookId") Long bookId, Pageable pageable);

    @Query("SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book WHERE b.member.id = :memberId AND b.status IN :statuses")
    List<BorrowRecord> findByMemberIdAndStatusInWithDetails(
            @Param("memberId") Long memberId, @Param("statuses") List<BorrowStatus> statuses);

    @Query("SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book WHERE b.status IN :statuses")
    List<BorrowRecord> findByStatusInWithDetails(@Param("statuses") List<BorrowStatus> statuses);

    long countByMemberIdAndStatusIn(Long memberId, List<BorrowStatus> statuses);

    List<BorrowRecord> findByDueDateAndStatusIn(LocalDate dueDate, List<BorrowStatus> statuses);

    Page<BorrowRecord> findByBookId(Long bookId, Pageable pageable);

    @Query("SELECT b.book.id, b.book.title, b.book.author, COUNT(b) FROM BorrowRecord b GROUP BY b.book.id, b.book.title, b.book.author ORDER BY COUNT(b) DESC")
    List<Object[]> findTopBorrowedBooks(Pageable pageable);

    @Query("SELECT FUNCTION('DATE_FORMAT', b.issueDate, '%Y-%m'), COUNT(b) FROM BorrowRecord b WHERE b.issueDate >= :since GROUP BY FUNCTION('DATE_FORMAT', b.issueDate, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', b.issueDate, '%Y-%m')")
    List<Object[]> countBorrowsByMonth(@Param("since") LocalDate since);

    @Query("SELECT FUNCTION('DATE_FORMAT', b.returnDate, '%Y-%m'), COUNT(b) FROM BorrowRecord b WHERE b.returnDate IS NOT NULL AND b.returnDate >= :since GROUP BY FUNCTION('DATE_FORMAT', b.returnDate, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', b.returnDate, '%Y-%m')")
    List<Object[]> countReturnsByMonth(@Param("since") LocalDate since);

    @Query("SELECT b FROM BorrowRecord b JOIN b.member m JOIN m.user u WHERE b.id = :id AND u.email = :email")
    Optional<BorrowRecord> findByIdAndMemberUserEmail(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT b FROM BorrowRecord b JOIN FETCH b.member m JOIN FETCH m.user JOIN FETCH b.book WHERE b.status = :status ORDER BY b.createdAt")
    List<BorrowRecord> findByStatusWithDetailsOrderByCreatedAt(@Param("status") BorrowStatus status);
}
