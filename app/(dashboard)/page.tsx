import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { options } from "../api/auth/[...nextauth]/options";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function Home() {
  const session = await getServerSession(options);

  return (
    <div className="px-8 py-10">
      <p className="text-heading2-bold">Belle Nippe</p>

      <Separator className="bg-grey-1 my-5" />
      <div className="grid md:grid-cols-3 gap-10">
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/dashboard">Logout</Link>
        ) : (
          <Link href="/api/auth/signin">Login</Link>
        )}
        <p>{session?.user?.email}</p>
        <p>{session?.user?.role}</p>
      </div>
    </div>
  );
}
