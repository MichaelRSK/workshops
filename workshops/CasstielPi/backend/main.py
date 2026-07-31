from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from database.mongodb import close_database, initialize_database
from models.notice import Notice
from schemas.notice import NoticeCreate, NoticeResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initialize_database()
    yield
    await close_database()


app = FastAPI(
    title="Notice Board API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def to_notice_response(notice: Notice) -> NoticeResponse:
    return NoticeResponse(
        id=str(notice.id),
        title=notice.title,
        message=notice.message,
        created_at=notice.created_at,
    )


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.get("/notices", response_model=list[NoticeResponse])
async def get_notices():
    notices = await Notice.find_all().sort("-created_at").to_list()

    return [to_notice_response(notice) for notice in notices]


@app.post(
    "/notices",
    response_model=NoticeResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_notice(data: NoticeCreate):
    notice = Notice(
        title=data.title,
        message=data.message,
    )

    await notice.insert()

    return to_notice_response(notice)


@app.delete(
    "/notices/{notice_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_notice(notice_id: str):
    try:
        notice = await Notice.get(notice_id)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid notice ID",
        ) from error

    if notice is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notice not found",
        )

    await notice.delete()

    return Response(status_code=status.HTTP_204_NO_CONTENT)


handler = Mangum(app)