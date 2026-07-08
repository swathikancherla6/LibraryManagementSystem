package com.library.management.service.impl;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookResponse;
import com.library.management.dto.response.PageResponse;
import com.library.management.entity.Book;
import com.library.management.entity.Category;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.BookMapper;
import com.library.management.enums.BorrowStatus;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.CategoryRepository;
import com.library.management.service.BookService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    @Override
    public PageResponse<BookResponse> getBooks(String title, String author, String isbn, String publisher, Long categoryId, int page, int size) {
        var pageable = PageRequest.of(page, Math.min(size, 50), Sort.by("title").ascending());
        var result = bookRepository.searchBooks(
                emptyToNull(title), emptyToNull(author), emptyToNull(isbn), emptyToNull(publisher), categoryId, pageable);
        return SecurityUtils.toPageResponse(result.map(BookMapper::toResponse));
    }

    @Override
    public BookResponse getBookById(Long id) {
        return BookMapper.toResponse(findBook(id));
    }

    @Override
    @Transactional
    public BookResponse createBook(BookRequest request) {
        if (bookRepository.existsByIsbn(request.getIsbn())) {
            throw new BadRequestException("ISBN already exists");
        }
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        int totalCopies = request.getTotalCopies() != null ? request.getTotalCopies() : 1;
        Book book = Book.builder()
                .title(request.getTitle())
                .isbn(request.getIsbn())
                .author(request.getAuthor())
                .publisher(request.getPublisher())
                .coverImageUrl(request.getCoverImageUrl())
                .description(request.getDescription())
                .category(category)
                .totalCopies(totalCopies)
                .availableCopies(totalCopies)
                .publishedYear(request.getPublishedYear())
                .build();

        return BookMapper.toResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = findBook(id);
        bookRepository.findByIsbn(request.getIsbn()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new BadRequestException("ISBN already exists");
            }
        });

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        int oldTotal = book.getTotalCopies();
        int newTotal = request.getTotalCopies() != null ? request.getTotalCopies() : oldTotal;
        int borrowed = oldTotal - book.getAvailableCopies();
        int newAvailable = Math.max(0, newTotal - borrowed);

        book.setTitle(request.getTitle());
        book.setIsbn(request.getIsbn());
        book.setAuthor(request.getAuthor());
        book.setPublisher(request.getPublisher());
        book.setCoverImageUrl(request.getCoverImageUrl());
        book.setDescription(request.getDescription());
        book.setCategory(category);
        book.setTotalCopies(newTotal);
        book.setAvailableCopies(newAvailable);
        book.setPublishedYear(request.getPublishedYear());

        return BookMapper.toResponse(bookRepository.save(book));
    }

    @Override
    @Transactional
    public void deleteBook(Long id) {
        Book book = findBook(id);
        if (borrowRecordRepository.existsByBookIdAndStatusIn(id,
                List.of(BorrowStatus.ISSUED, BorrowStatus.OVERDUE))) {
            throw new BadRequestException("Cannot delete a book with active borrows");
        }
        book.setActive(false);
        bookRepository.save(book);
    }

    private Book findBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    private String emptyToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
