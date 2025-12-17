CREATE TABLE `client_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`serviceType` enum('contabilidade','tributaria','pessoal','fiscal','abertura','administrativo') NOT NULL,
	`serviceName` varchar(255) NOT NULL,
	`description` text,
	`status` enum('pending','in_progress','awaiting_docs','review','completed','cancelled') NOT NULL DEFAULT 'pending',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`assignedToId` int,
	`startDate` timestamp,
	`dueDate` timestamp,
	`completedDate` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`company` varchar(255),
	`cnpj` varchar(20),
	`cpf` varchar(14),
	`address` text,
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceId` int NOT NULL,
	`status` varchar(50) NOT NULL,
	`message` text NOT NULL,
	`updatedById` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `service_updates_id` PRIMARY KEY(`id`)
);
