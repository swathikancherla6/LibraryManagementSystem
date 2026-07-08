package com.library.management.repository;

import com.library.management.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<WishlistItem, Long> {
    List<WishlistItem> findByMemberIdOrderByAddedAtDesc(Long memberId);
    Optional<WishlistItem> findByMemberIdAndBookId(Long memberId, Long bookId);
    boolean existsByMemberIdAndBookId(Long memberId, Long bookId);
    void deleteByMemberIdAndBookId(Long memberId, Long bookId);
}
