// src/constants/amenities.ts
export const AMENITIES = [
  "Separated CR",
  "Open CR",
  "Free Wifi",
  "Airconditioned",
  "Television",
  "Single Bed",
  "Twin Single Bed",
  "Queen Size Bed",
  "Receiving Area", 
] as const;

export type Amenity = (typeof AMENITIES)[number];