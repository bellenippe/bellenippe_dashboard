import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import LeftSideBar from "../../components/layout/LeftSideBar";
import TopBar from "../../components/layout/TopBar";
import { ToasterProvider } from "@/lib/ToasterProvider";

import { getServerSession } from "next-auth";
import SessionProvider from "@/lib/SessionProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard | Belle Nippe",
  description: "Administration du site Belle Nippe",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    // <ClerkProvider>
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider session={session} basePath="/api/auth">
          <ToasterProvider />
          <div className="flex max-lg:flex-col text-black">
            <LeftSideBar />
            <TopBar />
            <div className="flex-1">{children}</div>
          </div>
        </SessionProvider>
      </body>
    </html>
    // </ClerkProvider>
  );
}
