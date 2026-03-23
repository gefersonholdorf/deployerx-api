import type { FastifyInstance } from "fastify";
import type { SessionsRepository } from "repositories/sessions-repository";
import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import type { TotpService } from "services/totp/totp.service";

interface Verify2FAServiceRequest {
	code: string;
	cdUser: number;
	userAgent: string;
	ipAddress: string;
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
		private readonly sessionsRepository: SessionsRepository,
	) {}

	async execute({
		cdUser,
		code,
		ipAddress,
		userAgent,
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

			await this.sessionsRepository.create({
				dsIpAddress: ipAddress,
				dsTokenHash: token,
				dsUserAgent: userAgent,
				cdUser: user.cdUser,
				dtExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1d
				dtRevoked: null,
			});

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
