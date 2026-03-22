import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import { compareSync } from "bcrypt-ts";
import type { FastifyInstance } from "fastify";

interface LoginRequest {
	email: string;
	password: string;
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
	) {}

	async execute({
		email,
		password,
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
			return {
				right: {
					requires2FA: true,
					tempToken: "123TEMPTOKEN",
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

		return {
			right: {
				requires2FA: false,
				token,
			},
		};
	}
}
