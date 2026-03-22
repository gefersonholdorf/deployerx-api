import type { FastifyReply, FastifyRequest } from "fastify";

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
	} catch (error) {
		console.error(error);
		return reply.status(401).send({
			message: "Invalid token.",
		});
	}
};
