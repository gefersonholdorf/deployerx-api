import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authenticate } from "middlewares/authenticate";
import { DrizzleUsersRepository } from "repositories/drizzle-repository/drizzle-users-repository";
import { LoginService } from "services/auth/login.service";
import z from "zod";

export const authRoute = async (app: FastifyInstance) => {
	const drizzleUserService = new DrizzleUsersRepository(app);
	const loginService = new LoginService(app, drizzleUserService);

	app.withTypeProvider<ZodTypeProvider>().post(
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
		async (request, reply) => {
			const { email, password } = request.body;

			const { left, right } = await loginService.execute({
				email,
				password,
			});

			if (left) {
				if (left instanceof Error) {
					return reply.status(401).send({
						message: left.message,
					});
				}
			}

			return reply.status(200).send({
				token: right?.token,
				requires2FA: right?.requires2FA,
				tempToken: right?.tempToken,
			});
		},
	);

	app.post(
		"/2fa/setup",
		{
			preHandler: [authenticate],
			schema: {
				title: "Auth",
				description:
					"Initialize two-factor authentication setup by generating a secret and QR code for the user.",
				tags: ["Auth"],
				response: {
					200: z.object({
						qrCode: z.url(),
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
		(request, reply) => {
			return reply.status(200).send({
				qrCode: "https://api.com.br",
			});
		},
	);

	app.post("/2fa/enable", () => {});
	app.post("/2fa/verify", () => {});
};
