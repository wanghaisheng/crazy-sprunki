export interface ProductImage {
  webp: string;
  jpg: string;
  alt: string;
}

export interface ProductGalleryImage {
  large: ProductImage;
  small: ProductImage;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  isBestseller?: boolean;
}

export interface Accessory {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  isEssential?: boolean;
}

export interface ProductConfig {
  title: string;
  price: number;
  benefits: string[];
  sellingPoints: string[];
  galleryImages: ProductGalleryImage[];
  variants: ProductVariant[];
  accessories: Accessory[];
}