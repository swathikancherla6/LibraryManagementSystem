package com.library.management.service.impl;

import com.library.management.dto.request.WishlistRequest;
import com.library.management.dto.response.WishlistResponse;
import com.library.management.entity.Book;
import com.library.management.entity.Member;
import com.library.management.entity.WishlistItem;
import com.library.management.exception.BadRequestException;
import com.library.management.exception.ResourceNotFoundException;
import com.library.management.mapper.WishlistMapper;
import com.library.management.repository.BookRepository;
import com.library.management.repository.MemberRepository;
import com.library.management.repository.WishlistRepository;
import com.library.management.service.WishlistService;
import com.library.management.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final MemberRepository memberRepository;
    private final BookRepository bookRepository;
    private final SecurityUtils securityUtils;

    @Override
    public List<WishlistResponse> getMyWishlist() {
        Member member = getCurrentMember();
        return wishlistRepository.findByMemberIdOrderByAddedAtDesc(member.getId())
                .stream()
                .map(WishlistMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public WishlistResponse addToWishlist(WishlistRequest request) {
        Member member = getCurrentMember();
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (wishlistRepository.existsByMemberIdAndBookId(member.getId(), book.getId())) {
            throw new BadRequestException("Book already in wishlist");
        }

        WishlistItem item = WishlistItem.builder()
                .member(member)
                .book(book)
                .build();

        return WishlistMapper.toResponse(wishlistRepository.save(item));
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long bookId) {
        Member member = getCurrentMember();
        wishlistRepository.deleteByMemberIdAndBookId(member.getId(), bookId);
    }

    private Member getCurrentMember() {
        return memberRepository.findByUserId(securityUtils.getCurrentUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Member profile not found"));
    }
}
