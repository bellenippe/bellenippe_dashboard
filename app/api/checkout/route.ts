import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const corsHeader = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({ headers: corsHeader });
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer } = await req.json();

    if (!cartItems || !customer) {
      return NextResponse.json("Missing data to checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate: "shr_1PEZ1SP1p1SXpE4xRuT0GZQW",
        },
        {
          shipping_rate: "shr_1PEZ3AP1p1SXpE4xbbmfFOhr",
        },
      ],
      line_items: cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item.id,
              ...(cartItem.size && { size: cartItem.size }),
            },
          },
          unit_amount: cartItem.item.price * 100,
        },
        quantity: cartItem.quantity,
      })),
      client_reference_id: customer.clerkId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/mon-panier`,
    });

    return NextResponse.json(session, { headers: corsHeader });
  } catch (error) {
    console.log("[checkout_POST] Error: ", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
