// 通用类型定义
export interface ImageData {
  src: string;
  alt: string;
  webp?: string;
}

// TextIconCards 类型
export interface IconTextCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
}

// ProductComparison 类型
export interface Product {
  name: string;
  tag: string;
  image: string;
  price: string;
  link: string;
  learnMoreLink: string;
}

export interface Spec {
  name: string;
  icon: string;
  description: string;
}

// Mavic3Pro 类型
export interface CameraSpec {
  title: string;
  specs: string;
}

export interface Mavic3ProData {
  backgroundImages: string[];
  items: CameraSpec[];
}

// BuyNow 类型
export interface Guide {
  label: string;
  icon: string;
  link: string;
}

// HeroVerticalCards 类型
export interface Card {
  heading: string;
  description: string;
}