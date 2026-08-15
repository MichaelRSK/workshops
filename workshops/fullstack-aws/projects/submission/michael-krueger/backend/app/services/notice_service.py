# Client is the supabase-py client. It is only used as a type annotation on
# the first argument of every function here.
from supabase import Client

# The request model, used as the argument type on create_notice.
from app.models.notice import NoticeCreate

# The table this service reads and writes. Named once so a rename is a
# one-line change rather than a search across the file.
TABLE = "notices"

# The columns the API returns, matching the fields on NoticeOut.
#
# Listed explicitly rather than using "*" so that adding a column to the
# table later cannot start leaking it through the API. It also means the
# database sends back only what is actually used.
COLUMNS = "id, name, message, created_at"


# This module is the only place in the app that talks to Supabase.
#
# Every function takes the client as its first argument rather than reaching
# for get_client() itself. The controller injects it with Depends, which
# keeps the dependency visible at the call site and means these functions
# can be handed a stub client in a test without patching anything.
#
# Nothing here raises HTTPException or knows about status codes. A service
# that returns None or False leaves the controller to decide that "not
# found" means 404, which is what keeps the HTTP concerns in one layer and
# makes these functions reusable from somewhere that is not a web request,
# such as a scheduled cleanup job.


# Returns every notice, newest first.
#
# The sort is done by the database rather than in Python because Postgres
# can use an index for it, and because sorting here would only ever be
# sorting one page of results once pagination is added.
#
# id descending is a tie breaker. created_at defaults to now() and two
# notices posted in the same instant would otherwise come back in whatever
# order Postgres felt like, which makes the list jump around between
# refreshes. Higher ids are newer, so this keeps the order stable.
def list_notices(client: Client):
    response = (
        client.table(TABLE)
        .select(COLUMNS)
        .order("created_at", desc=True)
        .order("id", desc=True)
        .execute()
    )

    # supabase-py returns an object with the rows on .data. An empty board
    # is a perfectly normal answer, so an empty list is returned as is
    # rather than being treated as an error.
    return response.data


# Finds a single notice by its id.
# Returns None so the caller knows the notice does not exist.
#
# maybe_single() asks for one row and hands back None when there is none.
# The plain single() would raise instead, which would turn an ordinary
# "already deleted" into an exception the controller has to catch.
def get_notice(client: Client, notice_id: int):
    response = (
        client.table(TABLE)
        .select(COLUMNS)
        .eq("id", notice_id)
        .maybe_single()
        .execute()
    )

    # maybe_single can return None for the whole response, not just for
    # .data, depending on how the request was answered. Checking the
    # response first avoids an AttributeError on the miss path.
    if response is None:
        return None

    return response.data


# Creates one notice and returns the row the database wrote, so the caller
# gets the generated id and created_at without a second query.
#
# Raises ValueError if either field is blank once trimmed. Pydantic's
# min_length already rejected the empty string, but "   " passes that check
# and would otherwise be saved as a blank notice that no one can see or
# explain. This is a business rule rather than a shape rule, which is why it
# lives here and not on the model.
#
# ValueError, not HTTPException, on purpose. The service has no opinion on
# what status code a blank name deserves, it just refuses to store one. The
# controller catches this and answers 422.
#
# Returns None if the insert wrote nothing, which on Supabase almost always
# means an RLS policy refused it rather than that anything crashed.
def create_notice(client: Client, notice: NoticeCreate):
    name = notice.name.strip()
    message = notice.message.strip()

    if not name or not message:
        raise ValueError("name and message cannot be blank")

    # id and created_at are left out so the database fills them in with the
    # identity sequence and now(). See schema.sql.
    response = (
        client.table(TABLE)
        .insert({"name": name, "message": message})
        .execute()
    )

    if not response.data:
        return None

    return response.data[0]


# Deletes one notice by id.
# Returns True if it worked, False if there was no notice with that id.
#
# The existence check runs first so that "no such notice" is answered from a
# cheap read, and so this function can tell the difference between a delete
# that removed nothing because the id was wrong and one that removed nothing
# because a policy blocked it. Both look identical from the delete call
# alone.
#
# It does cost a second round trip, and strictly speaking two callers
# deleting the same notice at the same moment could both pass the check and
# one would get a True for a row the other removed. Neither matters on a
# notice board: the outcome the caller cares about, the notice being gone,
# is true either way.
def delete_notice(client: Client, notice_id: int):
    if get_notice(client, notice_id) is None:
        return False

    client.table(TABLE).delete().eq("id", notice_id).execute()

    return True
