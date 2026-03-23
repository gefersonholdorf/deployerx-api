import { usersSeed } from "db/seed/users-seed";

(async () => {
	console.log("Seeding database...");
	await Promise.all([usersSeed()]);
	console.log("Database seeding completed.");
})()
	.then(() => {
		console.log("All done!");
		process.exit(0);
	})
	.catch((error) => {
		console.error(
			"Error during seeding:",
			error instanceof Error ? error.message : String(error),
		);
		process.exit(1);
	});
