import type { sessions } from "db/schema/sessions";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

export interface Session extends InferSelectModel<typeof sessions> {}
export interface SessionCreate extends InferInsertModel<typeof sessions> {}

export interface SessionsRepository {
	create(data: SessionCreate): Promise<void>;
	findByCdUser(cdUser: number): Promise<Session | null>;
	save(session: Session, cdSession: number): Promise<void>;
}
