"use client";
import { DataTable } from "@/components/custom-ui/DataTable";
import React, { useEffect, useState } from "react";
import { columns } from "../../app/(dashboard)/collections/CollectionColumns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function CollectionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  const getCollection = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });

      const data = await res.json();
      setCollections(data);

      setLoading(false);
    } catch (error) {
      console.error("[Collection_GET]", error);
    }
  };

  useEffect(() => {
    getCollection();
  }, []);

  return (
    <section className="px-10 py-5">
      <div className="flex items-center justify-between">
        <p className="text-heading2-bold">Collections</p>
        <Button
          className="flex gap-2 bg-[#63817C] rounded-xl text-white hover:bg-[#696363] transition-all duration-200 ease-in-out"
          onClick={() => router.push("/collections/new")}
        >
          <Plus className="h-4 w-4" /> Créer une collection
        </Button>
      </div>
      <Separator className="bg-black my-4" />
      <DataTable columns={columns} data={collections} searchKey="title" />
    </section>
  );
}
