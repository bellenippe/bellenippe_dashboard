import UserAdmin from "@/lib/models/UserAdmin";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const POST = async (req: NextRequest) => {
  try {
    await connectToDB();

    const { name, email, password } = await req.json();

    if (!email || !password)
      return new NextResponse("Veuillez remplir tous les champs", {
        status: 400,
      });

    const exists = await UserAdmin.findOne({ email });
    if (exists) {
      return new NextResponse("L'utilisateur existe déjà", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserAdmin.create({ name, email, password: hashedPassword });

    return NextResponse.json(
      { message: "Inscription réussie" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[register_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
