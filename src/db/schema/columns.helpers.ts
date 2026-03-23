import { timestamp } from "drizzle-orm/mysql-core";

export const timestamps = {
	dtUpdatedAt: timestamp("dt_updated_at").defaultNow().notNull(),
	dtCreatedAt: timestamp("dt_created_at").defaultNow().notNull(),
	dtDeletedAt: timestamp("dt_deleted_at"),
};
