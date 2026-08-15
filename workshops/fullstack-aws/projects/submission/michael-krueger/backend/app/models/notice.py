# datetime is what created_at is parsed into. Supabase sends the column as
# an ISO 8601 string and Pydantic converts it for us.
from datetime import datetime

# BaseModel defines the shape of a request or response body. Field attaches
# the length rules below to individual fields.
from pydantic import BaseModel, Field


# The shape of the body POST /notices expects.
#
# Only name and message are here. id and created_at are deliberately absent
# because the database fills them in, and accepting them from the caller
# would let anyone post a notice claiming to be from last year.
#
# The "..." first argument to Field means the field is required. min_length
# rejects empty strings and strings of nothing but spaces would still get
# through, which is what the trim in the service is for.
#
# The max_length values are not arbitrary: they match the checks in
# schema.sql, so a body that is too long is refused here with a clear 422
# instead of travelling to Supabase and coming back as a database error.
class NoticeCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    message: str = Field(..., min_length=1, max_length=2000)


# The shape of a notice as the API returns it.
#
# Declaring this as the response_model on the endpoints does two useful
# things. It documents the response in the generated OpenAPI page, and it
# filters the outgoing data down to exactly these five fields, so a column
# added to the table later cannot leak through the API by accident.
#
# user_id is who posted the notice. It is on the response and not on
# NoticeCreate on purpose: the poster is taken from the token, never from the
# request body, so there is no way for a caller to post a notice under
# somebody else's id. It is returned so a frontend can work out which
# notices belong to the signed-in user and show a delete button only on
# those, which matches what the backend will actually allow.
class NoticeOut(BaseModel):
    id: int
    user_id: int
    name: str
    message: str
    created_at: datetime
