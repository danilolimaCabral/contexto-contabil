CREATE TABLE `client_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`serviceId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` enum('fiscal','contabil','pessoal','societario','outros') NOT NULL DEFAULT 'outros',
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` varchar(1000) NOT NULL,
	`mimeType` varchar(100),
	`fileSize` int,
	`uploadedById` int,
	`isProcessed` boolean DEFAULT false,
	`processedById` int,
	`processedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`serviceType` enum('contabilidade','fiscal','pessoal','abertura_empresa','alteracao_contratual','certidoes','consultoria','outros') NOT NULL,
	`description` text,
	`priority` enum('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
	`status` enum('pending','in_review','approved','converted','rejected') NOT NULL DEFAULT 'pending',
	`reviewedById` int,
	`reviewedAt` timestamp,
	`convertedToServiceId` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_requests_id` PRIMARY KEY(`id`)
);
