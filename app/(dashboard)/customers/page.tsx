import { DataTable } from "@/components/custom-ui/DataTable";
import { columns } from "@/components/customers/CustomerColumns";
import { Separator } from "@/components/ui/separator";
import Customer from "@/lib/models/Customer";
import { connectToDB } from "@/lib/mongoDB";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin?callbackUrl=/customers");
  await connectToDB();

  const customers = await Customer.find().sort({ createdAt: "desc" });
  return (
    <div className="px-10 py-5">
      <p className="text-heading2-bold">Clients</p>
      <Separator className="bg-grey-1 my-5" />
      <DataTable columns={columns} data={customers} searchKey="name" />
    </div>
  );
}
