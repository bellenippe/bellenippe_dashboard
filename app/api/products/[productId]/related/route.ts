import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();
    const product = await Product.findById(params.productId);
    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const relatedProducts = await Product.find({
      $or: [
        { collections: { $in: product.collections } },
        { category: product.category },
      ],
      _id: { $ne: product._id }, // On exclue le prduit actuel
    }).limit(4);

    if (!relatedProducts) {
      return new NextResponse(
        JSON.stringify({ message: "No related products found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (error) {
    console.log("[related_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
