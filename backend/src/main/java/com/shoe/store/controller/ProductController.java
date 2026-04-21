package com.shoe.store.controller;

import com.shoe.store.dto.ProductDto;
import com.shoe.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Public endpoint: Anyone can view products
    @GetMapping("/public/all")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // Public endpoint: Search products by type
    @GetMapping("/public/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String type) {
        return ResponseEntity.ok(productService.searchProductsByType(type));
    }

    // Public endpoint: Search products by name
    @GetMapping("/public/searchByName")
    public ResponseEntity<List<ProductDto>> searchProductsByName(@RequestParam String name) {
        return ResponseEntity.ok(productService.searchProductsByName(name));
    }

    // Public endpoint: Get specific product details
    @GetMapping("/public/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    // Secure endpoint: Only logged in Sellers can add products
    @PostMapping
    public ResponseEntity<ProductDto> createProduct(
            @ModelAttribute ProductDto productDto,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Authentication authentication
    ) {
        return ResponseEntity.ok(productService.createProduct(productDto, file, authentication.getName()));
    }
}
