-- Add category column with default 'uncategorized'
ALTER TABLE "Project" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'uncategorized';
