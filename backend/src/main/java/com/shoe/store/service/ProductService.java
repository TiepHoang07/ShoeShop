package com.shoe.store.service;

import com.shoe.store.dto.ProductDto;
import com.shoe.store.entity.Product;
import com.shoe.store.entity.Role;
import com.shoe.store.entity.User;
import com.shoe.store.repository.ProductRepository;
import com.shoe.store.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    private final String UPLOAD_DIR = "uploads/";

    public ProductDto createProduct(ProductDto request, MultipartFile file, String sellerEmail) {
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
                .imageUrl(saveFile(file))
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

    public List<ProductDto> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name)
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
                .imageUrl(product.getImageUrl())
                .sellerId(product.getSeller().getId())
                .build();
    }

    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not save file", e);
        }
    }
}
