import z from "zod";

const env = z.object({
	APP: z.enum(["development", "production", "test"]).default("development"),
	PORT: z.coerce.number().default(3000),
});

export const envSchema = env.parse(process.env);
