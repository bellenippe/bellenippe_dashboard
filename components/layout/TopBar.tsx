"use client";
import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

export default function TopBar() {
  const { data: session } = useSession();
  const [dropdownMenu, setDropdownMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-20 w-full flex justify-between items-center px-8 py-4 bg-[#2B2B2B] shadow-xl lg:hidden">
      <Link href="/">
        <Image
          src="/logos/bnFullWhiteLogo.png"
          alt="Logo Belle Nippe"
          width={150}
          height={150}
        />
      </Link>

      <div className="flex gap-8 max-md:hidden">
        {navLinks.map((link) => (
          <Link
            href={link.url}
            key={link.label}
            className={`flex gap-4 text-body-medium ${
              pathname === link.url ? "text-[#63817C]" : "text-white"
            }`}
          >
            <p>{link.label}</p>
          </Link>
        ))}
      </div>

      <div className="relative flex gap-4 items-center">
        <Menu
          className="cursor-pointer md:hidden text-white"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        />
        {dropdownMenu && (
          <div className="absolute top-10 right-6 flex flex-col gap-8 p-5 bg-[#2B2B2B] shadow-xl rounded-lg">
            {navLinks.map((link) => (
              <Link
                href={link.url}
                key={link.label}
                className={`flex gap-4 text-body-medium hover:text-[#63817C] ${
                  pathname === link.url ? "text-[#63817C]" : "text-white"
                }`}
              >
                <p>{link.label}</p>
              </Link>
            ))}
          </div>
        )}
        <div className="flex gap-4 text-body-medium items-center text-white">
          {session ? (
            <Link
              href="/api/auth/signout?callbackUrl=/dashboard"
              className="px-5 py-2 bg-[#63817C] text-[0.8rem] rounded-xl hover:bg-[#696363] transition-all duration-200 ease-in-out"
            >
              Logout
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
    </div>
  );
}
