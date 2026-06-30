CREATE TABLE `baskets` (
	`prefix` text,
	`b_id` integer,
	`description` text,
	`donors` text,
	`winning_ticket` integer,
	PRIMARY KEY(`prefix`, `b_id`)
);
--> statement-breakpoint
CREATE TABLE `prefixes` (
	`prefix` text PRIMARY KEY NOT NULL,
	`color` text,
	`weight` integer
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`prefix` text,
	`t_id` integer,
	`first_name` text,
	`last_name` text,
	`phone_number` text,
	`pref` text,
	PRIMARY KEY(`prefix`, `t_id`)
);
--> statement-breakpoint
CREATE VIEW `drawing` AS SELECT b.prefix, b.b_id, b.description, b.winning_ticket, t.last_name, t.first_name, t.phone_number
  FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY b.prefix, b.b_id;--> statement-breakpoint
CREATE VIEW `report_by_basket` AS SELECT b.prefix, b.b_id, b.description, b.donors, b.winning_ticket, t.last_name, t.first_name, t.phone_number, t.pref
  FROM baskets b LEFT JOIN tickets t on b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY b.prefix, b.b_id;--> statement-breakpoint
CREATE VIEW `report_by_name` AS SELECT t.last_name, t.first_name, t.phone_number, t.pref, b.prefix, b.b_id, b.description, b.donors, b.winning_ticket
  FROM baskets b LEFT JOIN tickets t ON b.prefix = t.prefix AND b.winning_ticket = t.t_id
  ORDER BY t.last_name, t.first_name, t.phone_number, b.prefix, b.b_id;--> statement-breakpoint
CREATE VIEW `report_counts` AS SELECT prefix, COUNT(DISTINCT(CONCAT(first_name, last_name, phone_number))) AS unique_buyers, COUNT(*) AS total_buys
  FROM tickets
  GROUP BY prefix
  UNION ALL
  SELECT 'Total', COUNT(DISTINCT(CONCAT(first_name, last_name, phone_number))), COUNT(*)
  FROM tickets;