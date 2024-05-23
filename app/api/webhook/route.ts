import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerInfo = {
        clerkId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };

      const shippingAdress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      };

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        // Avoir les métadonnées des produits
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      const lineItems = await retrieveSession?.line_items?.data;

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          size: item.price.product.metadata.size || "N/A",
          color: item.price.product.metadata.color || "N/A",
          quantity: item.quantity,
        };
      });

      console.log("[webhooks_POST] orderItems", orderItems);

      //! Création de la commande pour la stocker dans la database
      await connectToDB();

      const newOrder = new Order({
        customerClerkId: customerInfo.clerkId,
        products: orderItems,
        shippingAdress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      });

      // Après la création de la commande, je veux pouvoir faire appeler à mon méthode Patch pour mettre à jour le stock des produits commandés
      if (orderItems) {
        for (const item of orderItems) {
          const product = await Product.findById(item.product);
          product.stock -= item.quantity;
          await product.save();
        }
      }

      await newOrder.save();

      let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

      if (customer) {
        customer.orders.push(newOrder._id);
      } else {
        customer = new Customer({
          ...customerInfo,
          orders: [newOrder._id],
        });
      }

      //! Récupération des infos de la commande afin de l'envoyer pr mail
      // const customerDetails = {
      //   name: customerInfo.name,
      //   email: customerInfo.email,
      //   address: shippingAdress,
      //   order: {
      //     products: orderItems,
      //     shippingRate: session?.shipping_cost?.shipping_rate,
      //     totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      //   },
      // };

      // await fetch("api/send", {
      //   method: "POST",
      //   body: JSON.stringify({
      //     customerDetails,
      //   }),
      // });

      await customer.save();
    }

    return new NextResponse("Commande créée", { status: 200 });
  } catch (error) {
    console.log("[webhooks_POST] error", error);
    return NextResponse.json("An error occurred", { status: 500 });
  }
};
