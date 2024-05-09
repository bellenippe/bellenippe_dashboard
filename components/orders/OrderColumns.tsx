"use client";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "_id",
    header: "Commande",
    cell: ({ row }) => (
      <Link href={`/orders/${row.original._id}`} className="hover:text-red-500">
        {row.original._id}
      </Link>
    ),
  },
  {
    accessorKey: "customer",
    header: "Client",
  },
  {
    accessorKey: "products",
    header: "Produits",
  },
  {
    accessorKey: "totalAmount",
    header: "Total (€)",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
