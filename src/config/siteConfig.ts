// Config
// ------------
// Description: The configuration file for the website.

import siteConfig from '../data/json-files/siteConfig.json'
export const siteConfigData = siteConfig;

export const languages = siteConfig.site.supportLangs;

export const defaultLanguage = siteConfig.site.defaulti18;
  
export type Language = keyof typeof languages;
  
export interface Logo {
	src: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface AdSlots {
	vertical: string
	horizontal: string
	rectangle: string
}

export interface AdPositions {
	gameSides: boolean
	gameBottom: boolean
	betweenSections: boolean
	beforeCTA: boolean
}

export interface AdConfig {
	enabled: boolean
	client: string
	slots: AdSlots
	positions: AdPositions
	testMode: boolean
}

export interface ConfigType {
	siteTitle: string
	siteDescription: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
	ads: AdConfig
}

export const configData: ConfigType = {
	siteTitle: siteConfig.site.title,
	siteDescription: siteConfig.site.description,
	ogImage: siteConfig.site.ogImage,
	logo: siteConfig.site.logo,
	canonical: siteConfig.site.canonical,
	noindex: siteConfig.site.noindex,
	mode: siteConfig.site.mode as Mode,
	scrollAnimations: siteConfig.site.scrollAnimations,
	ads: {
		...siteConfig.ads,
		testMode: import.meta.env.DEV
	}
}
