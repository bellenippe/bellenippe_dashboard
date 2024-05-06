"use client";
import { Loader } from "@/components/custom-ui/Loader";
import { ProductForm } from "@/components/products/ProductForm";
import React, { useEffect, useState } from "react";

export default function ProductDetails({
  params,
}: {
  params: { productId: string };
}) {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const getProductDetails = async () => {
    try {
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET",
      });

      const data = await res.json();
      setProductDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("[ProductDetails_GET]", error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return loading ? <Loader /> : <ProductForm initialData={productDetails} />;
}
