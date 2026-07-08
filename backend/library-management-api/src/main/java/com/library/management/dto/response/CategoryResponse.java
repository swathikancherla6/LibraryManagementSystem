package com.library.management.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private long bookCount;
    private LocalDateTime createdAt;
}
