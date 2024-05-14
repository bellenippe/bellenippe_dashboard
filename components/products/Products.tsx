"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DataTable } from "@/components/custom-ui/DataTable";
import { Loader } from "@/components/custom-ui/Loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { columns } from "../../app/(dashboard)/products/ProductColumns";

export default function Products() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log("[getProducts]", error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <section className="px-10 pt-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Collections</p>
        <Button
          className="flex gap-2 bg-[#63817C] rounded-xl text-white hover:bg-[#696363] transition-all duration-200 ease-in-out"
          onClick={() => router.push("/products/new")}
        >
          <Plus className="mr-1 h-4 w-4" /> Créer un produit
        </Button>
      </div>
      <Separator className="bg-black my-4" />
      <DataTable columns={columns} data={products} searchKey="title" />
    </section>
  );
}
