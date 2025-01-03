import type { ImageMetadata } from 'astro';

// Image handling
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpeg,jpg,png,gif,webp,svg}', {
  eager: true
});

export function getImage(path: string): ImageMetadata {
  if(path==undefined){
    console.log('load imagee path emtpy')
    // return 
  }
  const fullPath = `/src/assets/${path}`;
  const image = images[fullPath];
  console.log('load image path',path)
  console.log('load image fullpath',path)

  if (!image) {
    // throw new Error(`Image not found: ${path}---fullpath:${fullPath}`);
  }
  
  return image.default;
}

// Formatting helpers
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}