import { mysqlTable, int, varchar, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const refreshTokens = mysqlTable("refresh_tokens", {
	cdRefreshToken: int("cd_refresh_token").primaryKey().autoincrement(),
	cdUser: int("cd_user")
		.notNull()
		.references(() => users.cdUser),
	dsUserAgent: varchar("ds_user_agent", { length: 255 }).notNull(),
	dsIpAddress: varchar("ds_ip_address", { length: 45 }).notNull(),
	dsTokenHash: varchar("ds_token_hash", { length: 255 }).notNull().unique(),
	dtRevoked: timestamp("dt_revoked"),
	dtExpiresAt: timestamp("dt_expires_at").notNull(),
	dtCreatedAt: timestamp("dt_created_at").defaultNow().notNull(),
});
