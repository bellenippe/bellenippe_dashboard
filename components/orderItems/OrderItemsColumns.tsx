"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Produit",
    cell: ({ row }) => (
      <Link
        href={`/products/${row.original.product._id}`}
        className="hover:text-[#63817C]"
      >
        {row.original.product.title}
      </Link>
    ),
  },
  {
    accessorKey: "size",
    header: "Taille",
  },
  {
    accessorKey: "color",
    header: "Couleur",
  },
  {
    accessorKey: "quantity",
    header: "Quantité",
  },
];
