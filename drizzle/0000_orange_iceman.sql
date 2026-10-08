CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`fullName` text NOT NULL,
	`telegramUsername` text NOT NULL,
	`phone` text NOT NULL,
	`city` text NOT NULL,
	`address` text NOT NULL,
	`postalCode` text NOT NULL,
	`deliveryMethod` text NOT NULL,
	`paymentMethod` text NOT NULL,
	`comment` text,
	`total` integer NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`categoryName` text NOT NULL,
	`price` integer NOT NULL,
	`oldPrice` integer,
	`inStock` integer DEFAULT true NOT NULL,
	`isPreorder` integer DEFAULT false,
	`stockCount` integer,
	`badge` text,
	`image` text NOT NULL,
	`fallbackGradient` text NOT NULL,
	`description` text NOT NULL,
	`size` text NOT NULL,
	`material` text NOT NULL,
	`features` text NOT NULL
);
