import type { ImageMetadata } from 'astro';

export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp' | 'avif' | 'svg';

export interface ProcessedImage {
  src: string | ImageMetadata | undefined;
  width: number;
  height: number;
  format: ImageFormat;
}

interface PlaceholderConfig {
  width?: number;
  height?: number;
  text?: string;
  format?: string;
  bgColor?: string;
  textColor?: string;
  quality?: number;
}

// Helper type guard to check if value is ImageMetadata
export function isImageMetadata(value: any): value is ImageMetadata {
  return value && typeof value === 'object' && 'src' in value && 'width' in value && 'height' in value;
}

// Helper function to detect format from URL or filename
function detectImageFormat(src: string): ImageFormat {
  const extension = src.toLowerCase().split('.').pop();
  switch (extension) {
    case 'png':
      return 'png';
    case 'jpg':
    case 'jpeg':
      return 'jpeg';
    case 'gif':
      return 'gif';
    case 'webp':
      return 'webp';
    case 'avif':
      return 'avif';
    case 'svg':
      return 'svg';
    default:
      return 'jpeg'; // Default format if cannot detect
  }
}

// Function to get remote image dimensions
export async function getRemoteImageDimensions(url: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}

// Create fallback image URL
function createPlaceholderUrl(config: PlaceholderConfig): string {
  const {
    width = 1200,
    height = 630,
    text = 'Image not found',
    bgColor = 'f7f6f6',
    textColor = '6d6e71'
  } = config;
  const encodedText = encodeURIComponent(text);
  return `https://images.placeholders.dev/?width=${width}&height=${height}&text=${encodedText}&bgColor=%23${bgColor}&textColor=%23${textColor}`;
}

export async function processImage(
  src: string | undefined,
  placeholderConfig?: PlaceholderConfig
): Promise<ProcessedImage> {
  if (!src) {
    return createFallbackImage('No image source provided', placeholderConfig);
  }
  if (isImageMetadata(src)) {
    return {
      src: src,
      width: src.width,
      height: src.height,
      format: detectImageFormat(src.src)
    };
  }
  // Handle remote URLs
  if (src.startsWith('http://') || src.startsWith('https://')) {
    try {
      const response = await fetch(src, { method: 'HEAD' });
      if (!response.ok) {
        console.warn(`Remote image not found: ${src}`);
        return createFallbackImage('Remote image not found', placeholderConfig);
      }

      // Try to get image dimensions for remote images
      const dimensions = await getRemoteImageDimensions(src);
      
      return {
        src: src,
        width: dimensions?.width || placeholderConfig?.width || 1920,
        height: dimensions?.height || placeholderConfig?.height || 1080,
        format: detectImageFormat(src)
      };
    } catch (error) {
      console.error('Error fetching remote image:', error);
      return createFallbackImage('Error loading remote image', placeholderConfig);
    }
  }

  try {
    // Process local image
    // Normalize the source path
    const normalizedSrc = src.startsWith('/@fs/') 
      ? src.split('/src/images/')[1] // Extract the relative path
      : src.startsWith('/src/images/') 
        ? src.slice(12) // Remove '/src/images/' prefix
        : src;

    // Import all images from the images directory
    const images = import.meta.glob<{ default: ImageMetadata }>(
      '/src/images/**/*.{jpeg,jpg,png,gif,webp,svg,avif}',
      { eager: true }
    );

    // Find the matching image
    const matchingKey = Object.keys(images).find(key => key.includes(normalizedSrc));
    const importedImage = matchingKey ? images[matchingKey].default : null;

    if (!importedImage) {
      console.error('Local image not found:', src);
      return createFallbackImage('Local image not found', placeholderConfig);
    }

    return {
      src: importedImage,
      width: importedImage.width,
      height: importedImage.height,
      format: detectImageFormat(importedImage.src)
    };
  } catch (error) {
    console.error('Error processing local image:', error, src);
    return createFallbackImage('Error processing image', placeholderConfig);
  }
}

function createFallbackImage(errorText: string, config?: PlaceholderConfig): ProcessedImage {
  const placeholderUrl = createPlaceholderUrl({
    width: config?.width || 1200,
    height: config?.height || 630,
    text: errorText,
    bgColor: config?.bgColor,
    textColor: config?.textColor
  });

  return {
    src: placeholderUrl,
    width: config?.width || 1200,
    height: config?.height || 630,
    format: 'png'
  };
}

export function getImageSrc(src: ImageMetadata | string): string {
  return isImageMetadata(src) ? src.src : src;
}

// Helper function to process multiple images
export async function processImages(
  sources: (string | undefined)[],
  config?: PlaceholderConfig
): Promise<ProcessedImage[]> {
  return Promise.all(sources.map(src => processImage(src, config)));
}

// Generate a low-quality placeholder image
export async function generatePlaceholder(
  src: string,
  width = 20
): Promise<ProcessedImage | null> {
  const originalImage = await processImage(src).catch(() => null);
  if (!originalImage) return null;

  const aspectRatio = originalImage.height / originalImage.width;
  const height = Math.round(width * aspectRatio);

  return processImage(src, {
    width,
    height,
    format: 'webp',
    quality: 20
  }).catch(() => null);
}

// Calculate dimensions while maintaining aspect ratio
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): { width: number; height: number } {
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio)
    };
  }

  if (targetHeight) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight
    };
  }

  return { width: originalWidth, height: originalHeight };
}