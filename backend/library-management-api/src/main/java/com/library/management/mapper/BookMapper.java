package com.library.management.mapper;

import com.library.management.dto.response.BookResponse;
import com.library.management.entity.Book;

public final class BookMapper {

    private BookMapper() {}

    public static BookResponse toResponse(Book book) {
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .author(book.getAuthor())
                .publisher(book.getPublisher())
                .coverImageUrl(book.getCoverImageUrl())
                .description(book.getDescription())
                .categoryId(book.getCategory().getId())
                .categoryName(book.getCategory().getName())
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .publishedYear(book.getPublishedYear())
                .active(book.getActive())
                .createdAt(book.getCreatedAt())
                .build();
    }
}
