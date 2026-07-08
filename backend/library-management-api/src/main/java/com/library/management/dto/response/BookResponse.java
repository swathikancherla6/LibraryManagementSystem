package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String isbn;
    private String author;
    private String publisher;
    private String coverImageUrl;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Integer totalCopies;
    private Integer availableCopies;
    private Integer publishedYear;
    private Boolean active;
    private LocalDateTime createdAt;
}
