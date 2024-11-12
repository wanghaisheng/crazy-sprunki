import navigationConfig from '../data/json-files/navigationConfig.json'
import siteConfig from '../data/json-files/siteConfig.json'

// Footer Navigation
// ------------
// Description: The footer navigation data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface FooterAbout {
	title: string
	aboutText: string
	logo: Logo
}

export interface SubCategory {
	subCategory: string
	subCategoryLink: string
}

export interface FooterColumn {
	category: string
	subCategories: SubCategory[]
}

export interface SubFooter {
	copywriteText: string
}

export interface FooterData {
	footerAbout: FooterAbout
	footerColumns: FooterColumn[]
	subFooter: SubFooter
}

export const footerNavigationData: FooterData = {
	footerAbout: navigationConfig.footer.about,
	footerColumns: navigationConfig.footer.columns,
	subFooter: {
		copywriteText: siteConfig.site.copyright
	}
}
