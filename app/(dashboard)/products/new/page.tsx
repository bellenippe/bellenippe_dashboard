import { ProductForm } from "@/components/products/ProductForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CreateProduct() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  return (
    <div>
      <ProductForm />
    </div>
  );
}
