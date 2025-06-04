"use client";

import { motion } from "framer-motion";
import Carousel from "../../components/LandingPage/Carousel";
import LocationDescription from "@/components/LandingPage/LocationDescription";
import ExploreFacilities from "@/components/LandingPage/ExploreFacilities";
import Footer from "@/components/LandingPage/footer";

export default function Home() {
  return (
    <main className="flex flex-col scrollbar-hide bg-gradient-to-b from-yellow-50 via-white to-yellow-100 transition-all duration-1000">
      <Carousel />

      <motion.div
        className="container mx-auto px-4 sm:px-6 py-6 md:py-8"
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <div className="flex justify-center items-center">
          <ExploreFacilities />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
      >
        <LocationDescription />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      >
        <Footer />
      </motion.div>
    </main>
  );
}
