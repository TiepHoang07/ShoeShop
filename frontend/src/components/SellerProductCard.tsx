import React from "react";
import { Trash2 } from "lucide-react";
import type { ProductDto } from "../pages/HomePage";

interface SellerProductCardProps {
  product: ProductDto;
  onDelete: (id: number) => void;
}

export default function SellerProductCard({ product, onDelete }: SellerProductCardProps) {
  return (
    <div
      className="bg-surface border border-border rounded-2xl flex flex-col hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
    >
      {product.imageUrl && (
        <div className="h-40 w-full overflow-hidden border-b border-border">
          <img 
            src={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:8081${product.imageUrl}`} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-xl leading-tight text-text">
            {product.name}
          </h3>
          <div className="px-2 py-1 bg-bg rounded-md text-xs font-semibold text-text-muted border border-border">
            {product.type}
          </div>
        </div>
        <p className="text-primary-dark font-black text-2xl mb-4">
          ${product.price.toFixed(2)}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="text-sm text-text-muted font-medium">
            Size: {product.size} &nbsp;&bull;&nbsp; Stock:{" "}
            <span
              className={
                product.quantity === 0
                  ? "text-primary"
                  : "text-primary-dark"
              }
            >
              {product.quantity}
            </span>
          </div>
          <button
            onClick={() => onDelete(product.id)}
            className="p-2.5 text-text-muted hover:text-primary-dark hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/30"
            title="Delete Product"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
