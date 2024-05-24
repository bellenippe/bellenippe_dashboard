import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await connectToDB();

    const orderDetails = await Order.findById(params.orderId).populate({
      path: "products.product",
      model: Product,
    });

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });
    }

    const customer = await Customer.findOne({
      clerkId: orderDetails.customerClerkId,
    });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (error) {
    console.error("[orderId_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//! Modifier le statut d'une commande
export const POST = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    const session = await getServerSession();

    interface User {
      name?: string;
      email?: string;
      role?: string;
    }
    const user = session?.user as User;
    if (!session || user.email !== process.env.ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const order = await Order.findById(params.orderId);
    if (!order) {
      return NextResponse.json("Order not found", { status: 404 });
    }

    const { statut } = await req.json();
    console.log("API", statut);

    const updatedOrder = await Order.findByIdAndUpdate(
      params.orderId,
      {
        statut,
      },
      { new: true }
    );

    // await updatedOrder.save();

    console.log(updatedOrder);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (err) {
    console.error("[ordersCustomersID_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
