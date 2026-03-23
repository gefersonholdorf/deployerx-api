CREATE TABLE `sessions` (
	`cd_session` int AUTO_INCREMENT NOT NULL,
	`cd_user` int NOT NULL,
	`ds_user_agent` varchar(255) NOT NULL,
	`ds_ip_address` varchar(45) NOT NULL,
	`ds_token_hash` varchar(255),
	`ds_temp_token` varchar(255),
	`dt_revoked` timestamp,
	`dt_expires_at` timestamp NOT NULL,
	`dt_created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sessions_cd_session` PRIMARY KEY(`cd_session`),
	CONSTRAINT `sessions_ds_token_hash_unique` UNIQUE(`ds_token_hash`),
	CONSTRAINT `sessions_ds_temp_token_unique` UNIQUE(`ds_temp_token`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`cd_user` int AUTO_INCREMENT NOT NULL,
	`nm_name` varchar(255) NOT NULL,
	`ds_email` varchar(255) NOT NULL,
	`ds_phone` varchar(20),
	`ds_cpf` varchar(11) NOT NULL,
	`ds_password_hash` varchar(255) NOT NULL,
	`ds_logo_url` varchar(255),
	`fl_active` boolean NOT NULL DEFAULT true,
	`fl_2fa_enabled` boolean NOT NULL DEFAULT false,
	`ds_2fa_secret` varchar(255),
	`dt_updated_at` timestamp NOT NULL DEFAULT (now()),
	`dt_created_at` timestamp NOT NULL DEFAULT (now()),
	`dt_deleted_at` timestamp,
	CONSTRAINT `users_cd_user` PRIMARY KEY(`cd_user`),
	CONSTRAINT `users_ds_email_unique` UNIQUE(`ds_email`),
	CONSTRAINT `users_ds_cpf_unique` UNIQUE(`ds_cpf`)
);
--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_cd_user_users_cd_user_fk` FOREIGN KEY (`cd_user`) REFERENCES `users`(`cd_user`) ON DELETE no action ON UPDATE no action;