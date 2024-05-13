import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    await connectToDB();
    const {
      title,
      description,
      media,
      collections,
      category,
      tags,
      size,
      colors,
      price,
      stock,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !stock) {
      return new NextResponse("Ce n'est pas assez pour créer un produit", {
        status: 400,
      });
    }

    const newProduct = await Product.create({
      title,
      description,
      media,
      collections,
      category,
      tags,
      size,
      colors,
      price,
      stock,
    });

    await newProduct.save();

    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log("[products_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    await connectToDB();

    const products = await Product.find({}).populate({
      path: "collections",
      model: Collection,
    });

    return new NextResponse(JSON.stringify(products), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.log("[products_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
