package com.library.management.service;

import com.library.management.dto.request.WishlistRequest;
import com.library.management.dto.response.WishlistResponse;

import java.util.List;

public interface WishlistService {
    List<WishlistResponse> getMyWishlist();
    WishlistResponse addToWishlist(WishlistRequest request);
    void removeFromWishlist(Long bookId);
}
