CREATE TABLE `news` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(500) NOT NULL,
	`summary` text,
	`content` text,
	`category` enum('fiscal','contabil','tributario','trabalhista','previdenciario','economia','reforma_tributaria') NOT NULL,
	`source` varchar(255) NOT NULL,
	`sourceUrl` varchar(1000),
	`imageUrl` varchar(1000),
	`author` varchar(255),
	`publishedAt` timestamp NOT NULL,
	`isFeatured` boolean DEFAULT false,
	`isActive` boolean DEFAULT true,
	`viewCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`)
);
