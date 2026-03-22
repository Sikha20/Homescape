"use client";
import { Show, UserButton } from "@clerk/nextjs";
import { LandPlot, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";

function NavBar() {
  const [showMenu, setShowMenu] = useState(false);
  const currentRoute = usePathname();

  const getRoute = (route: string) => {
    if (route === "/dashboard") return "/create-property";
    if (route === "/create-property") return "/dashboard";
    return "/dashboard";
  };

  return (
    <nav className="flex bg-background justify-between items-center sm:py-3 sm:px-5 px-1 mb-5">
      <Link href={"/"}>
        <div className="flex items-center justify-center">
          <Image
            className="h-16 w-16"
            src={"/logo.png"}
            alt={"logo"}
            height={30}
            width={30}
          />
          <span className="text-xs sm:text-lg">Rent Ease</span>
        </div>
      </Link>
      <div className="flex items-center justify-center sm:gap-2 gap-0">
        <Link href={getRoute(currentRoute)}>
          <button className="px-4 py-2 rounded-xl text-secondary transition duration-500 hover:bg-gray-200 outline-none sm:text-lg text-xs">
            {getRoute(currentRoute) === "/create-property"
              ? "Rent your property"
              : "Dashboard"}
          </button>
        </Link>
        <Show when="signed-in">
          <div className="flex items-center justify-center gap-4">
            <UserButton>

              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Listed Properties"
                  labelIcon={<LandPlot />}
                  href="/manage-listings"
                />
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </Show>
        <Show when="signed-out">
          <div className="md:hidden relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <Menu className="md:hidden" size={24} />
            </button>
            {showMenu && (
              <div className="md:hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <Link href={"/sign-in"}>
                  <button className="block w-full text-left px-4 py-2 text-secondary hover:bg-gray-100">
                    Sign In
                  </button>
                </Link>
                <Link href={"/sign-up"}>
                  <button className="block w-full text-left px-4 py-2 text-secondary hover:bg-gray-100">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="hidden md:flex items-center justify-center gap-2">
            <Link href={"/sign-in"}>
              <button className="px-4 py-2 text-secondary rounded-xl transition duration-500 hover:bg-gray-200 outline-none">
                Sign In
              </button>
            </Link>
            <Link href={"/sign-up"}>
              <button className="px-4 py-2 bg-primary text-background rounded-md hover:bg-red-700 transition duration-200">
                Sign Up
              </button>
            </Link>
          </div>
        </Show>
      </div>
    </nav>
  );
}

export default NavBar;
