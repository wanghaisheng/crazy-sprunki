// Social Links
// ------------
// Description: The social links data for the website.

import navigationConfig from '../data/json-files/navigationConfig.json'

export interface SocialLink {
	name: string
	link: string
	icon: string
}

export const socialLinks: SocialLink[] = navigationConfig.social
