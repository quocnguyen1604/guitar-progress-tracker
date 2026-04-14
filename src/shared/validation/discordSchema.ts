import * as z from "zod";

export const discordSettingsSchema = z.object({
  applicationId: z.string().trim().min(1, "Application ID is required"),
  botToken: z.string().trim().optional(),
  iconUpdateInterval: z
    .number()
    .int()
    .positive("Icon Update Interval must be a positive integer"),
});

export type DiscordSettingsInput = z.infer<typeof discordSettingsSchema>;
