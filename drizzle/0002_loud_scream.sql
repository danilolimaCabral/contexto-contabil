CREATE TABLE `staff_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`department` enum('fiscal','contabil','pessoal','paralegal') NOT NULL,
	`position` varchar(255),
	`isActive` boolean DEFAULT true,
	`avatarColor` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','staff') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `appointments` ADD `staffMemberId` int;--> statement-breakpoint
ALTER TABLE `appointments` ADD `serviceType` enum('contabilidade','tributaria','pessoal','fiscal','abertura','administrativo');--> statement-breakpoint
ALTER TABLE `leads` ADD `assignedToId` int;