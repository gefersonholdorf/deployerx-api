RENAME TABLE `refresh_tokens` TO `sessions`;--> statement-breakpoint
ALTER TABLE `sessions` RENAME COLUMN `cd_refresh_token` TO `cd_session`;--> statement-breakpoint
ALTER TABLE `sessions` DROP INDEX `refresh_tokens_ds_token_hash_unique`;--> statement-breakpoint
ALTER TABLE `sessions` DROP FOREIGN KEY `refresh_tokens_cd_user_users_cd_user_fk`;
--> statement-breakpoint
ALTER TABLE `sessions` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `sessions` ADD PRIMARY KEY(`cd_session`);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_ds_token_hash_unique` UNIQUE(`ds_token_hash`);--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_cd_user_users_cd_user_fk` FOREIGN KEY (`cd_user`) REFERENCES `users`(`cd_user`) ON DELETE no action ON UPDATE no action;