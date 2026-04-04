package com.shoe.store.service;

import com.shoe.store.dto.ProductDto;
import com.shoe.store.entity.Product;
import com.shoe.store.entity.Role;
import com.shoe.store.entity.User;
import com.shoe.store.repository.ProductRepository;
import com.shoe.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ProductDto createProduct(ProductDto request, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (seller.getRole() != Role.SELLER) {
            throw new RuntimeException("Only sellers can create products");
        }

        Product product = Product.builder()
                .name(request.getName())
                .type(request.getType())
                .description(request.getDescription())
                .size(request.getSize())
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .seller(seller)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToDto(savedProduct);
    }

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }
    
    public List<ProductDto> searchProductsByType(String type) {
        return productRepository.findByTypeContainingIgnoreCase(type)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDto(product);
    }

    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .type(product.getType())
                .description(product.getDescription())
                .size(product.getSize())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .sellerId(product.getSeller().getId())
                .build();
    }
}
