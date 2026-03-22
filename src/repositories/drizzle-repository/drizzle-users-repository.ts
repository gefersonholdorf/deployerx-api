import { users } from "db/schema/users";
import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { User, UsersRepository } from "repositories/users-repository";

export class DrizzleUsersRepository implements UsersRepository {
	constructor(private readonly app: FastifyInstance) {}

	async findUserByEmail(email: string): Promise<User | null> {
		const existingUserByEmail: User[] = await this.app.db
			.select()
			.from(users)
			.where(eq(users.dsEmail, email));

		if (existingUserByEmail.length <= 0) {
			return null;
		}

		return existingUserByEmail[0];
	}

	async findUserById(cdUser: number): Promise<User | null> {
		const existingUserById: User[] = await this.app.db
			.select()
			.from(users)
			.where(eq(users.cdUser, cdUser));

		if (existingUserById.length <= 0) {
			return null;
		}

		return existingUserById[0];
	}

	async save(user: User, cdUser: number): Promise<void> {
		await this.app.db.update(users).set(user).where(eq(users.cdUser, cdUser));
	}
}
