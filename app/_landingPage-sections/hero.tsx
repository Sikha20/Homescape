"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center gap-6 px-4 mt-32 md:pt-24">
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight md:leading-snug"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Live Anywhere, Rent with Ease - Flexible Housing Solutions
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg "
      >
        <h2 className="sr-only">About our rental platform</h2>
        <p className="text-lg md:text-xl font-medium text-muted-foreground text-gray-600">
          Be a landlord of your own space or a tenant in someone else&apos;s
          <br className="hidden md:block" />
          —flexibility in living arrangements at your fingertips. Discover
          affordable, short-term and long-term rental options today.
        </p>

        <div className="mt-5">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button
              className="text-white px-6 py-3 rounded-xl text-sm cursor-pointer"
              aria-label="Get started with our rental platform"
            >
              Get started
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
