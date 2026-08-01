from starlette.status import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR
from database import get_db
from fastapi import status, Depends, HTTPException, APIRouter
from models import Notice

api_router = APIRouter(prefix="/api/v1.0")

@api_router.get("/notices", status_code=status.HTTP_200_OK, response_model=list[Notice])
async def get_all_notices(db=Depends(get_db)):
    try:
        notice_list = await db["notices"].find({}).to_list(length=100)
        print(notice_list)
        if len(notice_list) <= 0:
            raise HTTPException(status_code=HTTP_404_NOT_FOUND,
                                detail="No notices in database")

        return notice_list

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))