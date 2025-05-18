// components/RoomImagesCarousel.tsx

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageFile } from "@/types/types"; // Make sure this path is correct
import NextImage from "next/image"; // Alias to avoid naming conflicts

export function RoomImagesCarousel({
  roomId,
  images,
}: {
  roomId: string;
  images: ImageFile[];
}) {
  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <p>No detailed images available.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: images.length > 1,
        }}>
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={image.id || `carousel-item-${roomId}-${index}`}>
              <Card className="overflow-hidden border-none shadow-none bg-transparent pb-10 h-full w-full">
                <CardContent className="relative h-full w-full flex aspect-square items-center justify-center p-5">
                  <NextImage
                    key={image.name || `image-${roomId}-${index}-${image.id}`}
                    alt={`Image ${index + 1} for room ${roomId}`}
                    src={`https://dwfbvqkcxeajmtqciozz.supabase.co/storage/v1/object/public/rooms/${roomId}/${image.name}`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 672p"
                    priority={index === 0}
                  />
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground border-border" />
            <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/60 hover:bg-background/90 text-foreground border-border" />
          </>
        )}
      </Carousel>
    </div>
  );
}
