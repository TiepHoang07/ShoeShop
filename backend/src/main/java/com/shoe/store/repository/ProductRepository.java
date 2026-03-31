package com.shoe.store.repository;

import com.shoe.store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByTypeContainingIgnoreCase(String type);
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findBySellerId(Long sellerId);
}
