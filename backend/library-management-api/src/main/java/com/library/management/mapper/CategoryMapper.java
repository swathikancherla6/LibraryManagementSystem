package com.library.management.mapper;

import com.library.management.dto.response.CategoryResponse;
import com.library.management.entity.Category;

public final class CategoryMapper {

    private CategoryMapper() {}

    public static CategoryResponse toResponse(Category category, long bookCount) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .bookCount(bookCount)
                .createdAt(category.getCreatedAt())
                .build();
    }

    public static CategoryResponse toResponse(Category category) {
        return toResponse(category, 0);
    }
}
