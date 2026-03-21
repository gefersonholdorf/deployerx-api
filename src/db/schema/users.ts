import { boolean } from "drizzle-orm/mysql-core";
import { timestamps } from "./columns.helpers";
import { mysqlTable, int, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
	cdUser: int("cd_user").primaryKey().autoincrement(),
	nmName: varchar("nm_name", { length: 255 }).notNull(),
	dsEmail: varchar("ds_email", { length: 255 }).notNull().unique(),
	dsPhone: varchar("ds_phone", { length: 20 }),
	dsCPF: varchar("ds_cpf", { length: 11 }).notNull().unique(),
	dsPasswordHash: varchar("ds_password_hash", { length: 255 }).notNull(),
	dsLogoURL: varchar("ds_logo_url", { length: 255 }),
	flActive: boolean("fl_active").default(true).notNull(),
	fl2FAEnabled: boolean("fl_2fa_enabled").default(false).notNull(),
	ds2FASecret: varchar("ds_2fa_secret", { length: 255 }),
	...timestamps,
});
