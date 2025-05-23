"use client";
import Image, { StaticImageData } from "next/image";

interface BannerProps {
  imageSrc: StaticImageData;
  title: string;
  subtitle: string;
}

const Banner = ({ imageSrc, title, subtitle }: BannerProps) => {
  return (
    <div className="relative overflow-hidden h-screen">
      <Image
        src={imageSrc}
        alt="Page Banner"
        layout="fill"
        objectFit="cover"
        objectPosition="bottom"
        className="absolute inset-0 brightness-50"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-semibold px-4 text-center">
        <div className="px-6 rounded-lg">
          <p className="text-4xl md:text-6xl">{title}</p>
        </div>

        <div className="mt-4 bg-opacity-60 px-4 py-2 rounded-md">
          <p className="text-xl font-normal opacity-90">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
