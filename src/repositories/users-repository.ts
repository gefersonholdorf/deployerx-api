import type { users } from "db/schema/users";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export interface User extends InferSelectModel<typeof users> {}

export interface UsersRepository {
	findUserByEmail(email: string): Promise<User | null>;
}
