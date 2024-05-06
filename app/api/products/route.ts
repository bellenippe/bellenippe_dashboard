import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { create } from "domain";
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
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price) {
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
      expense,
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

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find({}).populate({
      path: "collections",
      model: Collection,
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[products_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
