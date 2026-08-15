-- ===========================================================================
-- Notice Board: database schema for Supabase (hosted PostgreSQL)
-- ===========================================================================
--
-- HOW TO RUN THIS
--   Supabase dashboard, SQL Editor, New query, paste this whole file, Run.
--   You only need to do it once per project.
--
-- SAFE TO RE-RUN
--   Every statement is guarded with IF NOT EXISTS or a DROP POLICY IF EXISTS
--   ahead of the CREATE, so running the file a second time changes nothing
--   and reports notices rather than errors. That matters because the usual
--   reason to open this file again is that something did not work, and a
--   script you are afraid to re-run is not much help then.
--
--   Re-running does NOT delete existing notices. There is no DROP TABLE
--   here on purpose.
--
-- WHY RLS IS SET UP AT ALL
--   The backend reaches Supabase through PostgREST using the anon key, and
--   row level security genuinely applies to that key. This is different from
--   connecting straight to Postgres with a connection string as the
--   "postgres" role, which has BYPASSRLS and is never filtered.
--
--   So on this project the policies below are not decoration. With RLS
--   enabled and no policies, every query returns nothing and every insert is
--   refused, and it looks exactly like a bug in the API code.
-- ===========================================================================


-- ---------------------------------------------------------------------------
-- TABLE
-- ---------------------------------------------------------------------------
--
-- id            GENERATED ALWAYS AS IDENTITY is the modern replacement for
--               serial. "ALWAYS" means the database refuses an insert that
--               tries to supply its own id, which is the behaviour we want:
--               the API never sends one, and anything that does is a bug.
--
-- name,
-- message       NOT NULL because a notice with neither an author nor a body
--               is not a notice. The CHECK constraints go further and reject
--               a value that is empty or nothing but whitespace, which
--               NOT NULL alone allows through.
--
--               The length limits are text plus a CHECK rather than
--               varchar(n). They behave the same, but changing a CHECK later
--               is a cheap constraint swap while changing a varchar length is
--               a table rewrite. The numbers match the Field(max_length=...)
--               values in app/schemas.py, so keep the two in step.
--
-- created_at    timestamptz, not timestamp. timestamptz stores the instant in
--               UTC and converts on the way out, so a notice posted from a
--               laptop in another timezone still sorts correctly. Plain
--               timestamp would store the wall clock reading and quietly get
--               the order wrong.
--
--               DEFAULT now() is what lets the API leave the column out of
--               the insert entirely, which is the point: the posting time is
--               a fact the database observes, not something a caller should
--               be able to claim.
CREATE TABLE IF NOT EXISTS public.notices (
    id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        text        NOT NULL,
    message     text        NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),

    CONSTRAINT notices_name_not_blank
        CHECK (length(btrim(name)) > 0 AND length(name) <= 100),

    CONSTRAINT notices_message_not_blank
        CHECK (length(btrim(message)) > 0 AND length(message) <= 2000)
);


-- ---------------------------------------------------------------------------
-- INDEX
-- ---------------------------------------------------------------------------
--
-- GET /notices sorts by created_at DESC, id DESC on every single call, and
-- that is the only query this app makes against the table. An index in the
-- same order lets Postgres read the rows already sorted instead of fetching
-- the whole table and sorting it.
--
-- The column order in the index has to match the ORDER BY for that to work.
-- If the sort in app/routers/notices.py ever changes, change this too or it
-- silently stops being used.
--
-- On a board with a handful of notices this makes no measurable difference.
-- It is here because it costs nothing now and is the sort of thing nobody
-- remembers to add later, when the table is big enough for it to matter.
CREATE INDEX IF NOT EXISTS notices_created_at_id_desc_idx
    ON public.notices (created_at DESC, id DESC);


-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
--
-- Turn RLS on, then say what is allowed. Order matters in the sense that
-- enabling it without the policies below leaves the table locked to the anon
-- key, so run the whole file, not part of it.
--
-- A table created by raw SQL like this does not get RLS automatically.
-- Supabase only pre-ticks "Enable RLS" when the table is made through the
-- dashboard's table editor, so without the line below this table would be
-- readable and writable by anyone holding the anon key, which is a key that
-- is designed to be published in a frontend bundle.
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- DROP before CREATE because Postgres has no CREATE POLICY IF NOT EXISTS.
-- This is what makes the file re-runnable.
DROP POLICY IF EXISTS notices_select_anon ON public.notices;
DROP POLICY IF EXISTS notices_insert_anon ON public.notices;
DROP POLICY IF EXISTS notices_delete_anon ON public.notices;

-- Anyone may read every notice.
--
-- USING (true) means no row is filtered out. That is the correct rule for a
-- public notice board: the whole idea is that everybody sees the same wall.
--
-- "anon, authenticated" covers both keys. Only anon is used today, but
-- naming both means adding Supabase Auth later does not silently break
-- reads for signed-in users.
CREATE POLICY notices_select_anon
    ON public.notices
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Anyone may post a notice.
--
-- WITH CHECK is the insert-side equivalent of USING: it is tested against
-- the row being written. true accepts any row that already satisfies the
-- CHECK constraints on the table.
--
-- This is genuinely open, and worth being clear-eyed about: with the anon
-- key in a browser, anyone who can reach the API can post. That is the
-- assignment's brief and it is fine for a training project on a throwaway
-- Supabase project. It is not fine for anything real, and the fix is
-- Supabase Auth plus a WITH CHECK tied to auth.uid(), not a tweak here.
CREATE POLICY notices_insert_anon
    ON public.notices
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Anyone may delete any notice.
--
-- The same caveat as insert, more so: there is no notion of "your" notice
-- to check against yet, so this allows deleting somebody else's. It is what
-- makes DELETE /notices/{id} work at all without an auth system.
--
-- The natural next step, once notices have an owner, is
--   USING (auth.uid() = user_id)
-- which turns this into "you may delete your own".
CREATE POLICY notices_delete_anon
    ON public.notices
    FOR DELETE
    TO anon, authenticated
    USING (true);


-- ---------------------------------------------------------------------------
-- CHECK IT WORKED
-- ---------------------------------------------------------------------------
--
-- Run these in the SQL Editor after the script. Expect one table row and
-- three policy rows.
--
--   SELECT column_name, data_type, is_nullable, column_default
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name = 'notices'
--   ORDER BY ordinal_position;
--
--   SELECT polname, polcmd FROM pg_policy
--   WHERE polrelid = 'public.notices'::regclass;
--
-- A sample row, useful for confirming GET /notices returns something before
-- the frontend exists. Delete it whenever you like.
--
--   INSERT INTO public.notices (name, message)
--   VALUES ('Michael', 'First notice, the board is live.');
