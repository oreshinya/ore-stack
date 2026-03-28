CREATE TABLE "samples" ("id" text not null primary key, "name" text not null, "active" integer not null, "created_at" text not null, "updated_at" text not null);

CREATE INDEX "samples_active" on "samples" ("active");
