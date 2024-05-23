import ConfirmOrder from "@/app/emails/ConfirmOrder";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST() {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "inthegleam01@gmail.com",
      subject: "Confirmation de commande",
      react: ConfirmOrder(),
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[orderId_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
