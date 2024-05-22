// import OrdersConfirm from "@/app/emails/OrdersConfirm";
// import { NextResponse } from "next/server";
// import { Resend } from "resend";

// export async function GET() {
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   try {
//     const { data } = await resend.emails.send({
//       from: "Acme <onboarding@resend.dev>",
//       to: "inthegleam01@gmail.com",
//       subject: "Confirmation de commande",
//       react: OrdersConfirm(),
//     });
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error("[orderId_GET]", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
