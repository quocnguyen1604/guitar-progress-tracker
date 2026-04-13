import * as z from "zod";

export const songInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  artist: z.string().trim().optional(),
  thumbnailUrl: z.string().trim().optional(),
  thumbnailPath: z.string().trim().optional(),
  songLink: z.string().trim().optional(),
  tabLink: z.string().trim().optional(),
  localTabPath: z.string().trim().optional(),
  targetBpm: z.number().int().positive("Target BPM must be a positive integer"),
  currentPracticeBpm: z
    .number()
    .int()
    .positive("Current Practice BPM must be a positive integer"),
  progress: z
    .number()
    .int()
    .min(0)
    .max(100, "Progress must be between 0 and 100"),
  notes: z.string().trim().optional(),
});

export const updateSongInputSchema = songInputSchema.partial();

export type SongInput = z.infer<typeof songInputSchema>;
export type UpdateSongInput = z.infer<typeof updateSongInputSchema>;