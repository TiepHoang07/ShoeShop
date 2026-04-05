package com.shoe.store.controller;

import com.shoe.store.dto.WishlistDto;
import com.shoe.store.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getWishlist(Authentication authentication) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(authentication.getName()));
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishlistDto> addToWishlist(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(wishlistService.addToWishlist(productId, authentication.getName()));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromWishlist(
            @PathVariable Long itemId,
            Authentication authentication
    ) {
        wishlistService.removeFromWishlist(itemId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
