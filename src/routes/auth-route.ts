import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { DrizzleUsersRepository } from "repositories/drizzle-repository/drizzle-users-repository";
import { LoginService } from "services/auth/login.service";
import z from "zod";

export const authRoute = async (app: FastifyInstance) => {
	const drizzleUserService = new DrizzleUsersRepository(app);
	const loginService = new LoginService(drizzleUserService);

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

			try {
				const loginServiceResult = await loginService.execute({
					email,
					password,
				});

				return reply.status(200).send(loginServiceResult);
			} catch (error) {}
		},
	);

	app.post("/2fa/setup", () => {});
	app.post("/2fa/enable", () => {});
	app.post("/2fa/verify", () => {});
};
