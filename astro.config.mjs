import { defineConfig } from "astro/config";
import partytown from "@astrojs/partytown";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import compressor from "astro-compressor";

import sitemap from "@astrojs/sitemap";
import mdx from '@astrojs/mdx';

import compressor from "astro-compressor";

// https://astro.build/config
export default defineConfig({
  site: "https://crazysprunki.com/",
  trailingSlash: 'never',
  viewTransitions: true,

  build: {
    format: 'directory'
  },
  i18n: {
    locales: ["es", "en", "fr","zh"    ],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false
    }

  },


  integrations: [
    


    (await import("@playform/compress")).default(),

    compressor(

      {
        gzip: true,
        brotli: false
      }

    ),
    tailwind(), icon(), sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod :new Date(),
    i18n: {
      defaultLocale: 'en', // All urls that don't contain `es` or `fr` after `https://stargazers.club/` will be treated as default locale, i.e. `en`
      locales: {
        en: 'en-US', // The `defaultLocale` value must present in `locales` keys
        es: 'es-ES',
        fr: 'fr-CA',
      }
    }
  }
  
  ), partytown({
    config: {
      forward: ["dataLayer.push"],
    },
  }), compressor()],
});