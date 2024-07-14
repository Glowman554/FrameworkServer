CREATE TABLE `client_infos` (
	`version` text PRIMARY KEY NOT NULL,
	`end_of_life` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `cloud_configs` (
	`username` text PRIMARY KEY NOT NULL,
	`config` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `featured_servers` (
	`name` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`creation_date` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `telemetry_mods` (
	`session_id` integer NOT NULL,
	`mod_name` text NOT NULL,
	`enabled` integer NOT NULL,
	PRIMARY KEY(`mod_name`, `session_id`),
	FOREIGN KEY (`session_id`) REFERENCES `telemetry_sessions`(`session_id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `telemetry_sessions` (
	`username` text NOT NULL,
	`session_id` integer PRIMARY KEY NOT NULL,
	`timestamp` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	FOREIGN KEY (`username`) REFERENCES `telemetry_users`(`username`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `telemetry_users` (
	`username` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`username` text PRIMARY KEY NOT NULL,
	`password_hash` text NOT NULL,
	`admin` integer NOT NULL
);
