import type { FastifyReply, FastifyRequest } from "fastify";
import { DrizzleSessionsRepository } from "repositories/drizzle-repository/drizzle-sessions-repository";

export const authenticate = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		return reply.status(401).send({
			message: "Token not provided.",
		});
	}

	const [, token] = authHeader.split(" ");

	if (!token) {
		return reply.status(401).send({
			message: "Invalid token.",
		});
	}

	try {
		await request.jwtVerify();

		const user = request.user as { cdUser: number };

		const sessionsRepository = new DrizzleSessionsRepository(request.server);
		const lastSession = await sessionsRepository.findByCdUser(user.cdUser);

		if (!lastSession) {
			return reply.status(401).send({
				message: "Session expired. Please login again.",
			});
		}

		request.auth = {
			cdUser: user.cdUser,
		};
	} catch (error) {
		console.error(error);
		return reply.status(401).send({
			message: "Invalid token.",
		});
	}
};
