package com.library.management.repository;

import com.library.management.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);

    @Query("""
            SELECT b FROM Book b
            WHERE b.active = true
            AND (:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:author IS NULL OR LOWER(b.author) LIKE LOWER(CONCAT('%', :author, '%')))
            AND (:isbn IS NULL OR b.isbn = :isbn)
            AND (:publisher IS NULL OR LOWER(b.publisher) LIKE LOWER(CONCAT('%', :publisher, '%')))
            AND (:categoryId IS NULL OR b.category.id = :categoryId)
            """)
    Page<Book> searchBooks(
            @Param("title") String title,
            @Param("author") String author,
            @Param("isbn") String isbn,
            @Param("publisher") String publisher,
            @Param("categoryId") Long categoryId,
            Pageable pageable
    );

    long countByActiveTrue();
    long countByAvailableCopiesGreaterThanAndActiveTrue(int copies);

    @Query("SELECT COALESCE(SUM(b.availableCopies), 0) FROM Book b WHERE b.active = true")
    long sumAvailableCopies();

    long countByCategoryIdAndActiveTrue(Long categoryId);

    List<Book> findTop10ByActiveTrueOrderByCreatedAtDesc();

    @Query("SELECT c.name, COUNT(b) FROM Book b JOIN b.category c WHERE b.active = true GROUP BY c.name ORDER BY COUNT(b) DESC")
    List<Object[]> countBooksByCategory();
}
