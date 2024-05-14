// "use client";
// import { useSession } from "next-auth/react"; //! Protection côté client
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CollectionPage from "@/components/collections/CollectionPage";

export default async function CollectionPages() {
  //! Protection côté client
  // const { data: session } = useSession({
  //   required: true,
  //   onUnauthenticated() {
  //     redirect("/api/auth/signin?callbackUrl=/collections/page");
  //   },
  // });

  const session = await getServerSession();
  if (!session) redirect("/api/auth/signin?callbackUrl=/collections");

  return (
    <div>
      <CollectionPage />
    </div>
  );
}
