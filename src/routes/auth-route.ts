import type { FastifyInstance } from "fastify";
import z from "zod";

export const authRoute = async (app: FastifyInstance) => {
	app.post(
		"/login",
		{
			schema: {
				title: "Auth",
				description: "Authenticate a user and return a token or code TOTP",
				tags: ["Auth"],
				body: z.object({
					email: z.email(),
					password: z.string(),
				}),
				response: {
					200: z.object({
						token: z.string().optional(),
						requires2FA: z.boolean().optional(),
						tempToken: z.string().optional(),
					}),
					401: z.object({
						message: z.string(),
					}),
					500: z.object({
						message: z.string(),
					}),
				},
			},
		},
		async (request, reply) => {},
	);

	app.post("/2fa/setup", () => {});
	app.post("/2fa/enable", () => {});
	app.post("/2fa/verify", () => {});
};
