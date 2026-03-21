import { envSchema } from "env";
import fastify from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifyScalar from "@scalar/fastify-api-reference";
import { db } from "db/connection";

const app = fastify({
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
		servers: [],
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

app.decorate("db", db);

const port = envSchema.PORT;

app.listen({ port }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	if (envSchema.APP !== "production") {
		app.log.info(`DeployerX API is running at port ${port}`);
	}
});
