CREATE TABLE "todos" (
	"id" uuid PRIMARY KEY,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"completed" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
