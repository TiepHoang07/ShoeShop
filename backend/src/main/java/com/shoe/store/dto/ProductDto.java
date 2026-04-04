package com.shoe.store.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private Long id;
    private String name;
    private String type;
    private String description;
    private Double size;
    private Double price;
    private Integer quantity;
    private Long sellerId;
}
