package com.shoe.store.controller;

import com.shoe.store.dto.OrderDto;
import com.shoe.store.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<OrderDto> checkout(Authentication authentication) {
        return ResponseEntity.ok(orderService.checkout(authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(Authentication authentication) {
        return ResponseEntity.ok(orderService.getUserOrders(authentication.getName()));
    }
}
