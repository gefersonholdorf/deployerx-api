import { generateSecret, generate, verify, generateURI } from "otplib";
import {
	SecretTooShortError,
	TokenFormatError,
	CounterOverflowError,
} from "@otplib/core";
import QRCode from "qrcode";
import { envSchema } from "env";

interface VerifyTokenProps {
	token: string;
	secret: string;
}

interface GenerateQRCodeProps {
	userId: number;
	secret: string;
}

export class TotpService {
	async generateSecretClient() {
		return generateSecret();
	}

	async verifyToken({ token, secret }: VerifyTokenProps) {
		try {
			return verify({
				secret,
				token,
				epochTolerance: 30,
			});
		} catch (error) {
			if (error instanceof SecretTooShortError) {
				throw new Error("Secret is too short (minimum 16 bytes)");
			} else if (error instanceof TokenFormatError) {
				throw new Error("Token must contain only digits");
			} else if (error instanceof CounterOverflowError) {
				throw new Error("Counter has exceeded maximum value");
			}

			throw new Error("Invalid token");
		}
	}

	async generateCode(secret: string) {
		return generate({
			secret,
			digits: 6,
			period: 30,
			epoch: Date.now() / 1000,
		});
	}

	async generateQRCode({ userId, secret }: GenerateQRCodeProps) {
		const uri = generateURI({
			issuer: envSchema.APP_NAME,
			label: String(userId),
			secret,
		});

		const qrDataUrl = await QRCode.toDataURL(uri);

		return {
			secret,
			qrDataUrl,
			uri,
		};
	}
}
