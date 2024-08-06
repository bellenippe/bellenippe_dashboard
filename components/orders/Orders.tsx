"use client";
import { DataTable } from "@/components/custom-ui/DataTable";
import { Loader } from "@/components/custom-ui/Loader";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";

export default function Orders() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setOrders(data);
      console.log("[getOrders]", data);
      setLoading(false);
    } catch (error) {
      console.log("[getOrders]", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  console.log("[Orders] orders", orders);

  return loading ? (
    <Loader />
  ) : (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Commandes</p>
      <Separator className="bg-grey-1 my-5" />
      <DataTable columns={columns} data={orders} searchKey="_id" />
    </div>
  );
}
