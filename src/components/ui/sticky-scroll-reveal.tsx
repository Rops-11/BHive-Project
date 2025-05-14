"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StickyContent } from "@/types/types";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: StickyContent[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#FFFFFF",      // white
    "#F7EA87",      // light cream
    "#171717",      // dark gray
  ];

  const linearGradients = useMemo(() => [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan to emerald
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink to indigo
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange to yellow
  ], []);

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(
      linearGradients[activeCard % linearGradients.length]
    );
  }, [activeCard, linearGradients]);

  return (
    <motion.div
      animate={{
        backgroundColor:
          backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex justify-center items-start px-10 py-60 w-full gap-x-32"
      ref={ref}
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="mb-60 ">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-2xl font-bold text-[#D29D30]"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className={cn(
                  "text-kg mt-4 max-w-sm",
                  index === 2
                    ? activeCard === 2
                      ? "text-white"
                      : "text-black"
                    : "text-black"
                )}
              >
                {item.description}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-40 hidden h-[350px] w-[500px] overflow-hidden rounded-md bg-white lg:block mb-20",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
