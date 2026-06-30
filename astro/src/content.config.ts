import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ShitpostMarkdowns = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/ShitpostMarkdowns" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        album: z.string().optional(),
        comments: z.array(z.object({
            author: z.string(),
            text: z.string(),
            date: z.string().optional(),
        })).optional(),
    }),
});

export const collections = {
    ShitpostMarkdowns,
};