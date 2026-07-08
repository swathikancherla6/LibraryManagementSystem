package com.library.management.mapper;

import com.library.management.dto.response.WishlistResponse;
import com.library.management.entity.WishlistItem;

public final class WishlistMapper {

    private WishlistMapper() {}

    public static WishlistResponse toResponse(WishlistItem item) {
        return WishlistResponse.builder()
                .id(item.getId())
                .bookId(item.getBook().getId())
                .bookTitle(item.getBook().getTitle())
                .bookAuthor(item.getBook().getAuthor())
                .bookIsbn(item.getBook().getIsbn())
                .availableCopies(item.getBook().getAvailableCopies())
                .addedAt(item.getAddedAt())
                .build();
    }
}
