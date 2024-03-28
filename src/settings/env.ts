import { z } from "zod";

const envSchema = z.object({
    BOT_TOKEN: z.string({ description: "Discord Bot Token is required" }).readonly(),
    WEBHOOK_LOGS_URL: z.string().url().optional(),
    MONGO_URI: z.string({ description: "MongoDb URI is required" }),
    MAIN_GUILD_ID: z.string(),
    GEMINI_API_KEY: z.string()
});

type EnvSchema = z.infer<typeof envSchema>;

export { envSchema, EnvSchema };