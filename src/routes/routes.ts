import type { FastifyInstance } from "fastify";
import z from "zod";
import { usersRoute } from "./users-route";
import { authRoute } from "./auth-route";

export const routes = async (app: FastifyInstance) => {
	app.get(
		"/health",
		{
			schema: {
				title: "Health Check",
				description: "Check if the API is running",
				tags: ["Health"],
				response: {
					200: z.object({
						status: z.literal("up"),
					}),
				},
			},
		},
		async (_, reply) => {
			return reply.send({
				status: "up",
			});
		},
	);

	app.register(authRoute, { prefix: "/auth" });
	app.register(usersRoute, { prefix: "/users" });
};
