package com.shoe.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WishlistDto {
    private Long id;
    private Long productId;
    private String productName;
    private Double productPrice;
}
