import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

//! CREER UN NOUVEAU PRODUIT
export const POST = async (req: NextRequest) => {
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
    const {
      title,
      slug,
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
      slug,
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

export const dynamic = "force-dynamic";
