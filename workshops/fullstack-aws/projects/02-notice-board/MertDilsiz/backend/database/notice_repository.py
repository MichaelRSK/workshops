from bson import ObjectId
from bson.errors import InvalidId

from database.mongodb import get_database


class NoticeRepository:
    def __init__(self):
        self._database = get_database()
        self._collection = self._database["notices"]

    def _to_response(self, document):
        return {
            "id": str(document["_id"]),
            "name": document.get("name", ""),
            "message": document.get("message", ""),
        }

    def get_all(self):
        documents = self._collection.find().sort("_id", -1)
        return [self._to_response(document) for document in documents]

    def create(self, name, message):
        result = self._collection.insert_one(
            {
                "name": name,
                "message": message,
            }
        )

        return {
            "id": str(result.inserted_id),
            "name": name,
            "message": message,
        }

    def delete(self, notice_id):
        try:
            object_id = ObjectId(notice_id)
        except InvalidId:
            return False

        result = self._collection.delete_one({"_id": object_id})
        return result.deleted_count > 0
