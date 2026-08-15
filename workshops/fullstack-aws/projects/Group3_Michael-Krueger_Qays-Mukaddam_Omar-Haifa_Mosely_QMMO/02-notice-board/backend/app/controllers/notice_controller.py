# APIRouter lets us define these routes in their own file and plug them into
# main.py's app. Depends is how FastAPI hands the Supabase client to an
# endpoint. HTTPException is how we return a chosen status code instead of
# letting an error surface as a 500.
from fastapi import APIRouter, Depends, HTTPException

# Client is only used as a type annotation on the injected argument.
from supabase import Client

# get_client builds the Supabase client once and returns the same one after.
from app.db import get_client

# The request and response shapes, kept in one place so the controller stays
# about routing.
from app.models.notice import NoticeCreate, NoticeOut

# The service that does the actual work. Imported as a module rather than as
# loose function names, so a call reads as notice_service.create_notice and
# says plainly that the work happens a layer down.
from app.services import notice_service

# Create the router for notice related endpoints.
#
# prefix means every path below is relative to /notices, so the paths read
# as "" and "/{notice_id}" instead of repeating the word three times.
# tags is what groups these endpoints together on the /docs page.
router = APIRouter(prefix="/notices", tags=["notices"])


# Every endpoint here is deliberately thin. It takes the request apart,
# calls one service function, and turns what comes back into a status code.
# No endpoint builds a query, and none of them mention the notices table.


# GET /notices
# Returns every notice, newest first.
#
# response_model on the decorator, rather than a return annotation alone, is
# what makes FastAPI filter each row down to the four fields in NoticeOut.
@router.get("", response_model=list[NoticeOut])
def list_notices(client: Client = Depends(get_client)):
    return notice_service.list_notices(client)


# POST /notices
# Creates one notice from a JSON body of {"name": "...", "message": "..."}.
#
# 201 rather than the default 200, because a new resource was created. The
# created notice is returned in full so the frontend can add it to the list
# without re-fetching everything, and so the caller learns the id.
@router.post("", response_model=NoticeOut, status_code=201)
def create_notice(notice: NoticeCreate, client: Client = Depends(get_client)):
    # The service refuses a name or message that is blank once trimmed and
    # says so with a ValueError. Turning it into a 422 here matches the code
    # FastAPI already uses for a body that fails validation, so a caller
    # sees one consistent answer for "your body was not acceptable".
    try:
        created = notice_service.create_notice(client, notice)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    # None means the insert wrote nothing, which is worth saying clearly
    # instead of letting it become an unexplained 500 further down.
    if created is None:
        raise HTTPException(
            status_code=500,
            detail="Notice was not created. Check the insert policy on the "
            "notices table.",
        )

    return created


# DELETE /notices/{notice_id}
# Deletes one notice by id.
#
# 204 means "done, and there is nothing to send back", which is the usual
# answer for a delete. There is no body, so no response_model here.
#
# notice_id is annotated int, so /notices/abc is answered with a 422 by
# FastAPI before this function ever runs.
@router.delete("/{notice_id}", status_code=204)
def delete_notice(notice_id: int, client: Client = Depends(get_client)):
    # False means nothing had that id. Answering 404 tells the caller the
    # notice was already gone, which is more useful than a silent 204 that
    # looks like success.
    if not notice_service.delete_notice(client, notice_id):
        raise HTTPException(status_code=404, detail="Notice not found")

    # Nothing is returned. FastAPI sends the empty 204 response on its own.
    return None
