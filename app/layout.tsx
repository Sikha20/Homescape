import type { Metadata } from "next";
import { Poppins } from 'next/font/google'

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";


// font imported form google font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: "Homescape",
  description: "Homescape is a platform that helps you find the perfect place to rent and get a property.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider >
      <html lang="en">

        <body
          className={`${poppins.className}`}
        >
          <Toaster />


          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
