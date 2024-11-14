import { z, defineCollection } from 'astro:content'

const blogCollection = defineCollection({
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.date(),
			image: z.string(),
			author: z.string(),
			tags: z.array(z.string())
		})
})

const characterCollection = defineCollection({
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.date(),
			image: z.string(),
			author: z.string(),
			tags: z.array(z.string())
		})

	})

const gameCollection = defineCollection({

	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.date(),
			image: z.string(),
			author: z.string(),
			tags: z.array(z.string())
		})
	})

	const soundCollection = defineCollection({
		schema: () =>

			z.object({
				title: z.string(),
				description: z.string(),
				pubDate: z.date(),
				image: z.string(),

				author: z.string(),
				tags: z.array(z.string())
			})
		})
		const videoCollection = defineCollection({
			schema: () =>
				z.object({
					title: z.string(),
					description: z.string(),
					pubDate: z.date(),
					image: z.string(),
					author: z.string(),
					tags: z.array(z.string())
				})

			})


export const collections = {
	posts: blogCollection,
	games: gameCollection,
	videos: soundCollection,
	sounds: videoCollection,
	characters:characterCollection

}
