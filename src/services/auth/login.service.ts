import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import { compareSync } from "bcrypt-ts";
import type { FastifyInstance } from "fastify";
import type { SessionsRepository } from "repositories/sessions-repository";

interface LoginRequest {
	email: string;
	password: string;
	userAgent: string;
	ipAddress: string;
}

interface LoginResponse {
	token?: string;
	requires2FA?: boolean;
	tempToken?: string;
}

export class LoginService implements Service<LoginRequest, LoginResponse> {
	constructor(
		private readonly app: FastifyInstance,
		private readonly usersRepository: UsersRepository,
		private readonly sessionsRepository: SessionsRepository,
	) {}

	async execute({
		email,
		password,
		userAgent,
		ipAddress,
	}: LoginRequest): Promise<Either<Error, LoginResponse>> {
		const existingUserByEmail =
			await this.usersRepository.findUserByEmail(email);

		if (!existingUserByEmail) {
			return {
				left: new Error("Credentials invalid."),
			};
		}

		const isPasswordValid = compareSync(
			password,
			existingUserByEmail.dsPasswordHash,
		);

		if (!isPasswordValid) {
			return {
				left: new Error("Credentials invalid."),
			};
		}

		if (existingUserByEmail.fl2FAEnabled) {
			const tempToken = this.app.jwt.sign(
				{
					cdUser: existingUserByEmail.cdUser,
				},
				{
					expiresIn: "5m",
				},
			);

			return {
				right: {
					requires2FA: true,
					tempToken,
				},
			};
		}

		const token = await this.app.jwt.sign(
			{
				cdUser: existingUserByEmail.cdUser,
			},
			{
				expiresIn: "1d",
			},
		);

		await this.sessionsRepository.create({
			dsIpAddress: ipAddress,
			dsTokenHash: token,
			dsUserAgent: userAgent,
			cdUser: existingUserByEmail.cdUser,
			dtExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1d
			dtRevoked: null,
		});

		return {
			right: {
				requires2FA: false,
				token,
			},
		};
	}
}
