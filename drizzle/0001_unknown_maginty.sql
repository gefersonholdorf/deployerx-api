CREATE TABLE `refresh_tokens` (
	`cd_refresh_token` int AUTO_INCREMENT NOT NULL,
	`cd_user` int NOT NULL,
	`ds_user_agent` varchar(255) NOT NULL,
	`ds_ip_address` varchar(45) NOT NULL,
	`ds_token_hash` varchar(255) NOT NULL,
	`dt_revoked` timestamp,
	`dt_expires_at` timestamp NOT NULL,
	`dt_created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `refresh_tokens_cd_refresh_token` PRIMARY KEY(`cd_refresh_token`),
	CONSTRAINT `refresh_tokens_ds_token_hash_unique` UNIQUE(`ds_token_hash`)
);
--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_cd_user_users_cd_user_fk` FOREIGN KEY (`cd_user`) REFERENCES `users`(`cd_user`) ON DELETE no action ON UPDATE no action;