import { getServerSession } from "next-auth";
import SessionProvider from "@/lib/SessionProvider";

export const metadata = {
  title: "Belle Nippe | Login",
  description: "Administration du site Belle Nippe",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="fr">
      <SessionProvider session={session}>
        <body>{children}</body>
      </SessionProvider>
    </html>
  );
}
