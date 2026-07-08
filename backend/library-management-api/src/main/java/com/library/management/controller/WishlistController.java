package com.library.management.controller;

import com.library.management.dto.request.WishlistRequest;
import com.library.management.dto.response.ApiResponse;
import com.library.management.dto.response.WishlistResponse;
import com.library.management.service.WishlistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@RequiredArgsConstructor
@PreAuthorize("hasRole('MEMBER')")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WishlistResponse>>> getMyWishlist() {
        return ResponseEntity.ok(ApiResponse.success(wishlistService.getMyWishlist()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WishlistResponse>> add(@Valid @RequestBody WishlistRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Added to wishlist", wishlistService.addToWishlist(request)));
    }

    @DeleteMapping("/{bookId}")
    public ResponseEntity<ApiResponse<Void>> remove(@PathVariable Long bookId) {
        wishlistService.removeFromWishlist(bookId);
        return ResponseEntity.ok(ApiResponse.success("Removed from wishlist", null));
    }
}
