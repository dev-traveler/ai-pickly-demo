-- ============================================================================
-- Migration: Move pg_trgm Extension from public to extensions Schema
-- ============================================================================
-- Purpose: Resolve Supabase lint warning about pg_trgm in public schema
-- Impact: Drops and recreates 4 GIN indexes that depend on pg_trgm
-- Estimated time: ~10 seconds (minimal data in MVP)
-- ============================================================================

-- Step 1: Create dedicated extensions schema
-- ============================================================================
CREATE SCHEMA IF NOT EXISTS extensions;
COMMENT ON SCHEMA extensions IS 'Dedicated schema for PostgreSQL extensions to avoid polluting public namespace';

-- Step 2: Drop pg_trgm from public (CASCADE will drop dependent indexes)
-- ============================================================================
-- This will drop:
-- - Content_description_idx
-- - Content_title_idx
-- - Content_author_idx
-- - Tag_name_idx
DROP EXTENSION IF EXISTS pg_trgm CASCADE;

-- Step 3: Recreate pg_trgm in extensions schema
-- ============================================================================
CREATE EXTENSION pg_trgm WITH SCHEMA extensions;

-- Step 4: Recreate all GIN indexes that were dropped
-- ============================================================================

-- Recreate: Content_description_idx
CREATE INDEX "Content_description_idx" ON "Content" USING GIN ("description" extensions.gin_trgm_ops);

-- Recreate: Content_title_idx
CREATE INDEX "Content_title_idx" ON "Content" USING GIN ("title" extensions.gin_trgm_ops);

-- Recreate: Content_author_idx
CREATE INDEX "Content_author_idx" ON "Content" USING GIN ("author" extensions.gin_trgm_ops);

-- Recreate: Tag_name_idx
CREATE INDEX "Tag_name_idx" ON "Tag" USING GIN ("name" extensions.gin_trgm_ops);

-- Step 5: Update database search_path to include extensions schema
-- ============================================================================
-- This ensures that pg_trgm functions/operators are accessible without schema qualification
ALTER DATABASE postgres SET search_path TO public, extensions;

-- Note: In Supabase, you may need to run this as the postgres user or service_role
-- If you get a permission error, try:
-- ALTER ROLE postgres SET search_path TO public, extensions;

-- ============================================================================
-- Post-migration verification queries (run separately after migration)
-- ============================================================================

-- Verify pg_trgm is in extensions schema:
-- SELECT e.extname, n.nspname AS schema
-- FROM pg_extension e
-- JOIN pg_namespace n ON e.extnamespace = n.oid
-- WHERE e.extname = 'pg_trgm';
-- Expected result: pg_trgm | extensions

-- Verify all 4 indexes were recreated:
-- SELECT schemaname, tablename, indexname
-- FROM pg_indexes
-- WHERE indexname IN ('Content_description_idx', 'Content_title_idx', 'Content_author_idx', 'Tag_name_idx')
-- ORDER BY tablename, indexname;
-- Expected: 4 rows

-- Check search_path:
-- SHOW search_path;
-- Expected: public, extensions (or similar)
