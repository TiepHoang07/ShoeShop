package com.shoe.store.service;

import com.shoe.store.dto.WishlistDto;
import com.shoe.store.entity.Product;
import com.shoe.store.entity.User;
import com.shoe.store.entity.WishlistItem;
import com.shoe.store.repository.ProductRepository;
import com.shoe.store.repository.UserRepository;
import com.shoe.store.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public WishlistDto addToWishlist(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<WishlistItem> existingItem = wishlistRepository.findByUserIdAndProductId(user.getId(), product.getId());
        
        if (existingItem.isPresent()) {
            return mapToDto(existingItem.get()); // Already in wishlist
        }

        WishlistItem newItem = WishlistItem.builder()
                .user(user)
                .product(product)
                .build();
                
        return mapToDto(wishlistRepository.save(newItem));
    }

    public List<WishlistDto> getUserWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return wishlistRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromWishlist(Long itemId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        WishlistItem item = wishlistRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));
                
        if (!item.getUser().getId().equals(user.getId())) {
             throw new RuntimeException("Not authorized to remove this item");
        }
        
        wishlistRepository.delete(item);
    }

    private WishlistDto mapToDto(WishlistItem item) {
        return WishlistDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productPrice(item.getProduct().getPrice())
                .build();
    }
}
