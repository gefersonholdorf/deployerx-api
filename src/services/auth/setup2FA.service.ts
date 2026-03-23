import type { UsersRepository } from "repositories/users-repository";
import type { Either, Service } from "services/service";
import type { TotpService } from "services/totp/totp.service";

interface Setup2FAServiceRequest {
	cdUser: number;
}

interface Setup2FAServiceResponse {
	qrCode: string;
}

export class Setup2FAService
	implements Service<Setup2FAServiceRequest, Setup2FAServiceResponse>
{
	constructor(
		private readonly totpService: TotpService,
		private readonly usersRepository: UsersRepository,
	) {}

	async execute({
		cdUser,
	}: Setup2FAServiceRequest): Promise<Either<Error, Setup2FAServiceResponse>> {
		try {
			const secret = await this.totpService.generateSecretClient();

			const user = await this.usersRepository.findUserById(cdUser);

			if (!user) {
				return {
					left: new Error("User not found."),
				};
			}

			if (user.ds2FASecret) {
				return {
					left: new Error("Two-factor authentication is already enabled."),
				};
			}

			user.ds2FASecret = secret;

			await this.usersRepository.save(user, cdUser);

			const { qrDataUrl: qrCode } = await this.totpService.generateQRCode({
				secret,
				userEmail: user.dsEmail,
			});

			return {
				right: {
					qrCode,
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
