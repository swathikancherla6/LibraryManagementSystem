package com.library.management.service;

import com.library.management.dto.request.BookRequest;
import com.library.management.dto.response.BookResponse;
import com.library.management.dto.response.PageResponse;

public interface BookService {
    PageResponse<BookResponse> getBooks(String title, String author, String isbn, String publisher, Long categoryId, int page, int size);
    BookResponse getBookById(Long id);
    BookResponse createBook(BookRequest request);
    BookResponse updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
}
