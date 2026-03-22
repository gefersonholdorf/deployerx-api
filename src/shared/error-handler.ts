import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export const ErrorHandler = (app: FastifyInstance) => {
	app.setErrorHandler((error, _, reply) => {
		if (error instanceof ZodError) {
			return reply.status(400).send({
				error: "Bad Request",
				message: "Validation failed!",
				details: error.issues,
			});
		}

		console.error(error);

		return reply.status(500).send({
			error: "Server error",
			message: "Internal server error.",
		});
	});
};
