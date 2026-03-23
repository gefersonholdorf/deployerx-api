import { envSchema } from "./env";
import { app } from "./index";

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
