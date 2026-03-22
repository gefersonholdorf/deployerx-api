import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import { db } from "db/connection";
import { envSchema } from "env";
import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { routes } from "routes/routes";
import { ErrorHandler } from "shared/error-handler";

export const app = fastify({
	logger: envSchema.APP !== "production",
}).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "DeployerX API",
			version: "1.0.0",
		},
		servers: [
			{
				url: `http://localhost:3333`,
				description: "Development server",
			},
		],
		components: {
			securitySchemes: {
				ApiKeyAuth: {
					type: "apiKey",
					name: "Authorization",
					in: "header",
				},
			},
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifyScalar, {
	routePrefix: "/docs",
	logLevel: "silent",
	configuration: {
		theme: "kepler",
	},
});

app.register(fastifyJwt, {
	secret: envSchema.JWT_SECRET_KEY,
});

app.decorate("db", db);

app.register(ErrorHandler);
app.register(routes, { prefix: "/api/v1" });
