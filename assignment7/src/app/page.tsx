"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

// API에서 상품 데이터를 가져오는 함수
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 카테고리 목록을 한글로 표시 (내부 값은 영어)
  const categories = [
    { name: "전체", value: "all" },
    { name: "전자기기", value: "electronics" },
    { name: "쥬얼리", value: "jewelery" },
    { name: "남성의류", value: "men's clothing" },
    { name: "여성의류", value: "women's clothing" },
  ];

  // 컴포넌트가 처음 렌더링될 때 상품 데이터를 가져옴
  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // 선택된 카테고리에 따라 상품을 필터링
  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") {
      return true;
    }
    return product.category === selectedCategory;
  });

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">상품을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight lg:text-5xl">
          Discover Our Collection
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Quality products, curated for you.
        </p>
      </div>

      {/* 카테고리 버튼 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map((category) => (
          <Button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            variant={selectedCategory === category.value ? "default" : "outline"}
            className="capitalize"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* 상품 목록 */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            해당 카테고리의 상품이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
