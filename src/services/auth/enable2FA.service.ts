import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import type { TotpService } from "services/totp/totp.service";

interface Enable2FAServiceRequest {
	cdUser: number;
	code: string;
}

interface Enable2FAServiceResponse {
	message: string;
}

export class Enable2FAService
	implements Service<Enable2FAServiceRequest, Enable2FAServiceResponse>
{
	constructor(
		private readonly totpService: TotpService,
		private readonly usersRepository: UsersRepository,
	) {}

	async execute({
		cdUser,
		code,
	}: Enable2FAServiceRequest): Promise<
		Either<Error, Enable2FAServiceResponse>
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
					left: new Error("2FA authentication failed."),
				};
			}

			if (user.fl2FAEnabled) {
				return {
					left: new Error("2FA is already enabled."),
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

			user.fl2FAEnabled = true;

			await this.usersRepository.save(user, cdUser);

			return {
				right: {
					message: "2FA enabled.",
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
