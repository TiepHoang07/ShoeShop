package com.shoe.store.controller;

import com.shoe.store.dto.CartItemDto;
import com.shoe.store.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDto>> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getUserCart(authentication.getName()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItemDto> addToCart(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            Authentication authentication
    ) {
        return ResponseEntity.ok(cartService.addToCart(productId, quantity, authentication.getName()));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long itemId,
            Authentication authentication
    ) {
        cartService.removeFromCart(itemId, authentication.getName());
        return ResponseEntity.ok().build();
    }
}
