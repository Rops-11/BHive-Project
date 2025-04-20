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
    link: '/room-details',
    label: 'Rooms'
  },
  { 
    src: Food, 
    alt: 'Food', 
    link: '/dining',
    label: 'Restaurant'
  },
  { 
    src: Bar,
    alt: 'Bar', 
    link: '/bar',
    label: 'Bar'
  },
];

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-30 px-6 mt-12">
      {images.map((image, index) => (
        <Link href={image.link} key={index}>
          <div className="max-w-xs w-full rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform relative">
            <Image
              src={image.src}
              alt={image.alt}
              width={300}
              height={400}
              className="object-cover w-full h-auto aspect-[3/4] rounded-xl"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded-md">
              {image.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
