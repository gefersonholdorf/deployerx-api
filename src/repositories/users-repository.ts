import type { users } from "db/schema/users";
import type { InferSelectModel } from "drizzle-orm";

export interface User extends InferSelectModel<typeof users> {}

export interface UsersRepository {
	findUserByEmail(email: string): Promise<User | null>;
	findUserById(cdUser: number): Promise<User | null>;
	save(User: User, cdUser: number): Promise<void>;
}
