package com.library.management.repository;

import com.library.management.entity.Fine;
import com.library.management.enums.FineStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FineRepository extends JpaRepository<Fine, Long> {
    Page<Fine> findByStatus(FineStatus status, Pageable pageable);
    Page<Fine> findByMemberId(Long memberId, Pageable pageable);
    List<Fine> findByMemberIdAndStatus(Long memberId, FineStatus status);
    long countByMemberIdAndStatus(Long memberId, FineStatus status);
    Optional<Fine> findByBorrowRecordId(Long borrowRecordId);

    @Query("SELECT f FROM Fine f JOIN f.member m JOIN m.user u WHERE f.id = :id AND u.email = :email")
    Optional<Fine> findByIdAndMemberUserEmail(@Param("id") Long id, @Param("email") String email);
}
