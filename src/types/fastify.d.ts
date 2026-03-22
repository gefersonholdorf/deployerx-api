import "fastify";
import type { db } from "db/connection";

declare module "fastify" {
	interface FastifyInstance {
		db: typeof db;
	}
	interface FastifyRequest {
		auth: {
			cdUser: number;
		};
	}
}
