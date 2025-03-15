'use client';

import Image from 'next/image';
import Link from 'next/link';
import SingleTwin from '@/assets/SingleTwin.jpg';
import Food from '@/assets/foodlanding.jpg';
import Bar from '@/assets/barpic.jpg';

const images = [
  { 
    src: SingleTwin,
    alt: 'Room', 
    link: '/room-details' 
  },
  { 
    src: Food, 
    alt: 'Food', 
    link: '/dining' 
  },
  { 
    src: Bar,
    alt: 'Bar', 
    link: '/bar' 
  },
];

export default function Gallery() {
  return (
    <div className="flex gap-12 justify-center mt-12"> {/* Increased gap */}
      {images.map((image, index) => (
        <Link href={image.link} key={index}>
          <div className="w-56 h-80 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform"> {/* Increased size */}
            <Image
              src={image.src}
              alt={image.alt}
              width={224} // Increased width
              height={320} // Increased height
              className="object-cover w-full h-full"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
