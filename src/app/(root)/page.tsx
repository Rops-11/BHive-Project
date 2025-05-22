"use client";

import { motion } from "framer-motion";
import Carousel from "../../components/LandingPage/Carousel";
import LocationDescription from "@/components/LandingPage/LocationDescription";
import ExploreFacilities from "@/components/LandingPage/ExploreFacilities";
import Footer from "@/components/LandingPage/footer";

export default function Home() {
  return (
    <main className="flex flex-col scrollbar-hide bg-gradient-to-b from-yellow-50 via-white to-yellow-100 transition-all duration-1000">
      {/* Carousel - stays static */}
      <Carousel />

      {/* Explore Facilities with fade-in scroll effect */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 py-6 md:py-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex justify-center items-center">
          <ExploreFacilities />
        </div>
      </motion.div>

      {/* Location Description with scroll effect */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <LocationDescription />
      </motion.div>

      {/* Footer fades in last */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Footer />
      </motion.div>
    </main>
  );
}
