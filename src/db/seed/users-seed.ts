import { users } from "db/schema/users";
import { app } from "index";
import { eq } from "drizzle-orm";
import { genSaltSync, hashSync } from "bcrypt-ts";

export const usersSeed = async () => {
	try {
		const existingUser = await app.db
			.select({
				cdUser: users.cdUser,
			})
			.from(users)
			.where(eq(users.dsEmail, "admin@example.com"));

		if (existingUser.length > 0) {
			return;
		}

		const SALT = genSaltSync(10);

		const dsPasswordHash = hashSync("admin", SALT);

		return await app.db.insert(users).values({
			nmName: "admin",
			dsEmail: "admin@example.com",
			dsPasswordHash,
			dsCPF: "12345678901",
			flActive: true,
			fl2FAEnabled: false,
			dsPhone: "479911246560",
		});
	} catch (error) {
		throw new Error(
			`Error seeding users: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
};
