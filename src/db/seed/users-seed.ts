import { users } from "db/schema/users";
import { app } from "index";

export const usersSeed = async () => {
	try {
		await app.db.insert(users).values({
			nmName: "admin",
			dsEmail: "admin@example.com",
			dsPasswordHash: "admin",
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
