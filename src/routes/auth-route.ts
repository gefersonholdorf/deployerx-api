import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { authenticate } from "middlewares/authenticate";
import { DrizzleUsersRepository } from "repositories/drizzle-repository/drizzle-users-repository";
import { Enable2FAService } from "services/auth/enable2FA.service";
import { LoginService } from "services/auth/login.service";
import { Setup2FAService } from "services/auth/setup2FA.service";
import { Verify2FAService } from "services/auth/verify2FA.service";
import { TotpService } from "services/totp/totp.service";
import z from "zod";

export const authRoute = async (app: FastifyInstance) => {
	const drizzleUserService = new DrizzleUsersRepository(app);
	const totpService = new TotpService();

	const loginService = new LoginService(app, drizzleUserService);
	const setup2FAService = new Setup2FAService(totpService, drizzleUserService);
	const enable2FAService = new Enable2FAService(
		totpService,
		drizzleUserService,
	);
	const verify2FAService = new Verify2FAService(
		app,
		totpService,
		drizzleUserService,
	);

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

				return reply.status(500).send({
					message: "Internal server error.",
				});
			}

			return reply.status(200).send({
				token: right?.token,
				requires2FA: right?.requires2FA,
				tempToken: right?.tempToken,
			});
		},
	);

	app.withTypeProvider<ZodTypeProvider>().post(
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
		async (request, reply) => {
			const { cdUser } = request.auth;

			const { left, right } = await setup2FAService.execute({ cdUser });

			if (left) {
				if (left instanceof Error) {
					return reply.status(500).send({
						message: left.message,
					});
				}

				return reply.status(500).send({
					message: "Internal server error.",
				});
			}

			return reply.status(200).send({
				qrCode: right.qrCode,
			});
		},
	);

	app.withTypeProvider<ZodTypeProvider>().post(
		"/2fa/enable",
		{
			preHandler: [authenticate],
			schema: {
				title: "Auth",
				description:
					"Enables two-factor authentication (2FA) by validating the provided OTP code for the authenticated user.",
				tags: ["Auth"],
				body: z.object({
					code: z.string(),
				}),
				response: {
					200: z.object({
						message: z.string(),
					}),
					400: z.object({
						message: z.string(),
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
			const { cdUser } = request.auth;
			const { code } = request.body;

			const { left, right } = await enable2FAService.execute({ cdUser, code });

			if (left) {
				if (left instanceof Error) {
					return reply.status(500).send({
						message: left.message,
					});
				}

				return reply.status(500).send({
					message: "Internal server error.",
				});
			}

			return reply.status(200).send({
				message: right.message,
			});
		},
	);

	app.withTypeProvider<ZodTypeProvider>().post(
		"/2fa/verify",
		{
			preHandler: [authenticate],
			schema: {
				title: "Auth",
				description: "Verify a user's 2FA code and complete authentication.",
				tags: ["Auth"],
				body: z.object({
					code: z.string(),
				}),
				response: {
					200: z.object({
						token: z.string(),
					}),
					400: z.object({
						message: z.string(),
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
			const { code } = request.body;
			const { cdUser } = request.auth;

			const { left, right } = await verify2FAService.execute({ code, cdUser });

			if (left) {
				if (left instanceof Error) {
					return reply.status(500).send({
						message: left.message,
					});
				}
				return reply.status(500).send({
					message: "Internal server error.",
				});
			}

			return reply.status(200).send({
				token: right.token,
			});
		},
	);
};
