package com.shoe.store.service;

import com.shoe.store.dto.OrderDto;
import com.shoe.store.dto.OrderItemDto;
import com.shoe.store.entity.*;
import com.shoe.store.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderDto checkout(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double totalAmount = 0.0;
        
        Order order = Order.builder()
                .user(user)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();
                
        // Before saving order, calculate total and prepare items
        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }
            
            // Deduct stock
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
            productRepository.save(product);
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();
                    
            return orderItem;
        }).collect(Collectors.toList());

        for (OrderItem item : orderItems) {
            totalAmount += item.getPrice() * item.getQuantity();
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems); // cascade saves the OrderItems
        
        Order savedOrder = orderRepository.save(order);
        
        // Clear the cart!
        cartItemRepository.deleteByUserId(user.getId());

        return mapToDto(savedOrder);
    }

    public List<OrderDto> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderDto mapToDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems().stream()
                .map(item -> OrderItemDto.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderDto.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .items(itemDtos)
                .build();
    }
}
