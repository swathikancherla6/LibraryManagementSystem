package com.library.management.repository;

import com.library.management.entity.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUserId(Long userId);
    Optional<Member> findByMembershipNumber(String membershipNumber);
    boolean existsByMembershipNumber(String membershipNumber);
    long countByActiveTrue();
    Page<Member> findByActiveTrue(Pageable pageable);

    @Query("SELECT FUNCTION('DATE_FORMAT', m.joinedDate, '%Y-%m'), COUNT(m) FROM Member m WHERE m.joinedDate >= :since GROUP BY FUNCTION('DATE_FORMAT', m.joinedDate, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', m.joinedDate, '%Y-%m')")
    List<Object[]> countMembersByMonth(@Param("since") LocalDate since);
}
