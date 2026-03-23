import { sessions } from "db/schema/sessions";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type {
	Session,
	SessionCreate,
	SessionsRepository,
} from "repositories/sessions-repository";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class DrizzleSessionsRepository implements SessionsRepository {
	constructor(private readonly app: FastifyInstance) {}

	async create(data: SessionCreate): Promise<void> {
		const nowBR = dayjs().toDate();

		await this.app.db
			.update(sessions)
			.set({
				dtRevoked: nowBR,
			})
			.where(eq(sessions.cdUser, data.cdUser));
		await this.app.db.insert(sessions).values(data);
	}

	async findByCdUser(cdUser: number): Promise<Session | null> {
		const now = new Date();

		const result = await this.app.db
			.select()
			.from(sessions)
			.where(
				and(
					eq(sessions.cdUser, cdUser),
					gt(sessions.dtExpiresAt, now),
					isNull(sessions.dtRevoked),
				),
			)
			.orderBy(desc(sessions.dtCreatedAt))
			.limit(1);

		if (result.length <= 0) {
			return null;
		}

		return result[0];
	}

	async save(session: Session, cdSession: number): Promise<void> {
		this.app.db
			.update(sessions)
			.set(session)
			.where(eq(sessions.cdSession, cdSession));
	}
}
