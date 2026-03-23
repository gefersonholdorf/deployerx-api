import { drizzle } from "drizzle-orm/mysql2";
import { envSchema } from "env";

export const db = drizzle(envSchema.DATABASE_URL, {
	logger: envSchema.APP !== "production",
});
