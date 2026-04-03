"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-end px-4 sm:px-12 lg:px-24 py-32 mt-16 overflow-hidden">
      {/* Background Image spanning the entire section */}
      <div 
        className="absolute inset-0 bg-[url('/background_interior.png')] bg-cover bg-center bg-no-repeat"
      />
      
      {/* Soft overlay to ensure overall design elegance */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Floating White Card matching the UI reference */}
      <motion.div
        className="relative z-10 w-full max-w-2xl bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] p-10 md:p-14 lg:mr-10"
        initial={{ opacity: 0, x: 50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#789274] uppercase mb-4 block">
          Homescape Real Estate
        </span>
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-gray-900 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Live Anywhere,<br />Rent with Ease
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-xl mt-6"
        >
          <h2 className="sr-only">Flexible housing solutions</h2>
          <p className="text-lg md:text-xl font-medium text-gray-600 leading-relaxed mb-10">
            Be a landlord of your own space or a tenant in someone else&apos;s
            —flexibility in living arrangements at your fingertips. Discover
            affordable, short-term and long-term rental options today.
          </p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-[#789274] hover:bg-[#5a6d56] text-white px-10 py-7 rounded-2xl text-lg font-semibold shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                aria-label="Get started with our rental platform"
              >
                Get started
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 border-gray-200 text-gray-700 hover:border-[#789274] hover:text-[#789274] hover:bg-transparent px-10 py-7 rounded-2xl text-lg font-semibold hover:-translate-y-1 transition-all duration-300"
              >
                Browse Properties
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
