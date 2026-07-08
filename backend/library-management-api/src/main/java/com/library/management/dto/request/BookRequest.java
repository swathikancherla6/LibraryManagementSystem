package com.library.management.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    @NotBlank(message = "Author is required")
    private String author;

    private String publisher;

    private String coverImageUrl;

    private String description;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies;

    private Integer publishedYear;
}
