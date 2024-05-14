import Products from "@/components/products/Products";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function ProductPage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin?callbackUrl=/products");

  return <Products />;
}
