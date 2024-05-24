import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

//! Récupérer une product par son ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.productId).populate({
      path: "collections",
      model: Collection,
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.log("[productsID_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//! MODIFIER UN PRODUIT
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
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
    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

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

    if (!title || !description || !media || !category || !price) {
      return new NextResponse("Ce n'est pas assez pour créer un produit", {
        status: 400,
      });
    }

    // Pour ajouter une collection à un produit lors de sa modification : si la collection n'est pas déjà incluse, on l'inclue
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    // Pour supprimer une collection d'un produit lors de la modification
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    console.log("addedCollections", addedCollections);
    console.log("removedCollections", removedCollections);

    // Cette fonction update les collections du produits qu'on modifie
    await Promise.all([
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: params.productId },
        })
      ),

      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: params.productId },
        })
      ),
    ]);

    // update product
    const updatedProduct = await Product.findByIdAndUpdate(
      params.productId,
      {
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
      },
      { new: true }
    ).populate({ path: "collections", model: Collection });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.log("[productsID_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//! SUPPRIMER UN PRODUIT
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
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
    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    // Update collections (lui enlever le produit qu'on supprime) :
    await Promise.all(
      product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: params.productId },
        })
      )
    );
  } catch (error) {
    console.log("[productId_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
