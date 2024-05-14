import SalesGraph from "@/components/custom-ui/SalesGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../../api/auth/[...nextauth]/options";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session) redirect("/api/auth/signin?callbackUrl=/dashboard");

  const totalRevenue = await getTotalSales().then((data) => data.totalRevenue);
  const totalOrders = await getTotalSales().then((data) => data.totalOrders);
  const totalCustomers = await getTotalCustomers();
  const graphData = await getSalesPerMonth();
  return (
    <section className="px-8 py-10">
      <div className="flex justify-between">
        <h1 className="text-heading2-bold">Dashboard</h1>
        {/* {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )} */}
        <div>
          {/* <p>{session?.user?.email}</p> */}
          <p className="uppercase">{session?.user?.role}</p>
        </div>
      </div>

      <Separator className="bg-grey-1 my-5" />
      <div className="grid md:grid-cols-3 gap-10">
        <Card className="">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Revenu Total</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalRevenue} €</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Commandes</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Client</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-10">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Ventes</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesGraph data={graphData} />
        </CardContent>
      </Card>
    </section>
  );
}
