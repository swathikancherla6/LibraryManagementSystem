package com.library.management.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "membership_number", nullable = false, unique = true, length = 50)
    private String membershipNumber;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(name = "membership_type", length = 50)
    @Builder.Default
    private String membershipType = "STANDARD";

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Column(name = "joined_date", nullable = false)
    private LocalDate joinedDate;

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<BorrowRecord> borrowRecords = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<Fine> fines = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WishlistItem> wishlistItems = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
