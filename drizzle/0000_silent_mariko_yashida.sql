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
