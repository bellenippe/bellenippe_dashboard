import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import Collection from "@/lib/models/Collection";
import { NextRequest, NextResponse } from "next/server";
import Product from "@/lib/models/Product";

//! Récupérer une collection par son ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await connectToDB();

    const collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (error) {
    console.log("[collectionsID_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//! Modifier une collection par son ID
export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let collection = await Collection.findById(params.collectionId);

    if (!collection) {
      return new NextResponse(
        JSON.stringify({ message: "Collection not found" }),
        { status: 404 }
      );
    }

    const { title, description, image } = await req.json();

    if (!title) return new NextResponse("Title is required", { status: 400 });

    collection = await Collection.findByIdAndUpdate(
      params.collectionId,
      { title, description, image },
      { new: true }
    );

    await collection.save();

    return new NextResponse("Collection updated", { status: 200 });
  } catch (error) {
    console.log("[collectionID_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

//! Supprimer une collection par son ID
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Collection.findByIdAndDelete(params.collectionId);

    //Pour supprimer la collection de tous les produits qui lui sont associés
    await Product.updateMany(
      { collections: params.collectionId },
      { $pull: { collections: params.collectionId } }
    );

    return new NextResponse("Collection deleted", { status: 200 });

    const { collectionId } = params;
  } catch (error) {
    console.log("[collections_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
