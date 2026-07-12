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

const DrawingMarkdowns = defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/2dDrawingsMarkdowns" }),
    schema: z.object({
        title: z.string(),
        date: z.date(),
        album: z.string().optional(),
        images: z.array(z.string()).optional(),
    }),
});


export const collections = {
    ShitpostMarkdowns,
    DrawingMarkdowns,
};