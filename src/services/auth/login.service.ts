import type { UsersRepository } from "repositories/users-repository";
import type { Service } from "services/service";

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
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ email, password }: LoginRequest): Promise<LoginResponse> {
		const existingUserByEmail =
			await this.usersRepository.findUserByEmail(email);

		if (!existingUserByEmail) {
			throw new Error("E-m")
		}
		return {};
	}
}
