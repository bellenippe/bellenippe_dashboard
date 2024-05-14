"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";

export default function LeftSideBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="h-screen left-0 top-0 sticky p-10 flex flex-col gap-16 bg-[#2B2B2B] shadow-2xl max-lg:hidden">
      <Link href="/">
        <Image
          src="/logos/bnFullWhiteLogo.png"
          alt="Logo Belle Nippe"
          width={150}
          height={150}
        />
      </Link>

      <div className="flex flex-col gap-12">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium hover:text-[#63817C] ${
              pathname === link.url ? "text-[#63817C]" : "text-white"
            }`}
          >
            {link.icon} <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="flex gap-4 text-body-medium items-center text-white">
        {session ? (
          <Link
            href="/api/auth/signout?callbackUrl=/dashboard"
            className="px-5 py-2 bg-[#63817C] text-[0.8rem] rounded-xl hover:bg-[#696363] transition-all duration-200 ease-in-out"
          >
            Se déconnecter
          </Link>
        ) : (
          <Link
            href="/api/auth/signin"
            className="px-5 py-2 bg-[#63817C] text-[0.8rem] rounded-xl hover:bg-[#696363] transition-all duration-200 ease-in-out"
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
}
