import z from "zod";

const env = z.object({
	APP: z.enum(["development", "production", "test"]).default("development"),
	APP_NAME: z.string(),
	PORT: z.coerce.number().default(3000),
	DATABASE_URL: z.string(),
});

export const envSchema = env.parse(process.env);
