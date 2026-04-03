"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, Home } from "lucide-react";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="flex sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo Section */}
        <Link href="/" className="flex items-center shrink-0">
          <div className="flex items-center justify-center bg-primary rounded-full p-2">
            <Home className="h-6 w-6 text-white" />
          </div>
          <span className="ml-2 text-xl font-bold text-primary">Homescape</span>
        </Link>

        {/* Desktop Navigation - Adjusted spacing */}
        <nav className="hidden md:flex items-center justify-center space-x-2 lg:space-x-6 ml-6 mr-4">
          <Link
            href="#features"
            className="px-3 py-2 text-sm font-medium hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="px-3 py-2 text-sm font-medium hover:text-primary"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="px-3 py-2 text-sm font-medium hover:text-primary"
          >
            Testimonials
          </Link>
          <Link
            href="#faq"
            className="px-3 py-2 text-sm font-medium hover:text-primary"
          >
            FAQ
          </Link>
        </nav>

        {/* Button Section - Fixed with proper background color */}
        <Link href="/create-property" className="hidden md:block shrink-0">
          <Button className=" text-white rounded-full px-6">
            Rent Your Property
          </Button>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-full"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden py-4 px-4 border-t bg-background absolute top-16 left-0 right-0">
          <nav className="flex flex-col space-y-3">
            <Link
              href="#features"
              className="text-sm font-medium py-2 hover:bg-gray-100 rounded-md px-3"
              onClick={toggleMenu}
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium py-2 hover:bg-gray-100 rounded-md px-3"
              onClick={toggleMenu}
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium py-2 hover:bg-gray-100 rounded-md px-3"
              onClick={toggleMenu}
            >
              Testimonials
            </Link>
            <Link
              href="#faq"
              className="text-sm font-medium py-2 hover:bg-gray-100 rounded-md px-3"
              onClick={toggleMenu}
            >
              FAQ
            </Link>
            <Link href="/create-property" className="mt-2" onClick={toggleMenu}>
              <Button className="w-full hover:bg-[#789274] text-white rounded-full">
                Rent Your Property
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
