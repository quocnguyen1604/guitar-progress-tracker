import * as z from "zod";

export const songInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  artist: z.string().trim().optional(),
});

export type SongInput = z.infer<typeof songInputSchema>;
