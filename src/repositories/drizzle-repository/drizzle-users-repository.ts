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
}
