import type { FastifyInstance } from "fastify";
import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import type { TotpService } from "services/totp/totp.service";

interface Verify2FAServiceRequest {
	code: string;
	cdUser: number;
}

interface Verify2FAServiceResponse {
	token: string;
}

export class Verify2FAService
	implements Service<Verify2FAServiceRequest, Verify2FAServiceResponse>
{
	constructor(
		private readonly app: FastifyInstance,
		private readonly totpService: TotpService,
		private readonly usersRepository: UsersRepository,
	) {}

	async execute({
		cdUser,
		code,
	}: Verify2FAServiceRequest): Promise<
		Either<Error, Verify2FAServiceResponse>
	> {
		try {
			const user = await this.usersRepository.findUserById(cdUser);

			if (!user) {
				return {
					left: new Error("User not found."),
				};
			}

			if (!user.ds2FASecret) {
				return {
					left: new Error("Two-factor authentication needs to be configured."),
				};
			}

			const { valid } = await this.totpService.verifyCode({
				token: code,
				secret: user.ds2FASecret,
			});

			if (!valid) {
				return {
					left: new Error("2FA authentication failed."),
				};
			}

			const token = await this.app.jwt.sign(
				{
					cdUser: user.cdUser,
				},
				{
					expiresIn: "1d",
				},
			);

			return {
				right: {
					token,
				},
			};
		} catch (error) {
			console.error(error);
			return {
				left: new Error("Internal server error."),
			};
		}
	}
}
