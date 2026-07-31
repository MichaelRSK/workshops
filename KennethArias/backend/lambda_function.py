import json
import os
from datetime import datetime, timezone

from bson import ObjectId
from pymongo import MongoClient

MONGO_HOST = os.environ["MONGO_HOST"]
MONGO_PORT = int(os.environ.get("MONGO_PORT", 27017))
MONGO_DATABASE = os.environ.get("MONGO_DATABASE", "notification_board")


def get_collection():
    client = MongoClient(
        host=MONGO_HOST,
        port=MONGO_PORT,
        serverSelectionTimeoutMS=5000,
    )
    return client[MONGO_DATABASE]["notices"]


def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path = event.get("rawPath", "/").rstrip("/") or "/"

    if method == "OPTIONS":
        return response(200, {})

    try:
        if method == "GET" and path == "/notices":
            return get_notices()

        if method == "POST" and path == "/notices":
            return create_notice(parse_body(event))

        if method == "PUT" and path.startswith("/notices/"):
            notice_id = path.split("/")[-1]
            return update_notice(notice_id, parse_body(event))

        if method == "DELETE" and path.startswith("/notices/"):
            notice_id = path.split("/")[-1]
            return delete_notice(notice_id)

        return response(404, {"error": f"Route not found: {method} {path}"})
    except Exception as exc:
        print(f"Error: {exc}")
        return response(500, {"error": "Internal server error"})


def parse_body(event):
    raw_body = event.get("body") or "{}"
    if event.get("isBase64Encoded"):
        import base64
        raw_body = base64.b64decode(raw_body).decode("utf-8")
    return json.loads(raw_body)


def get_notices():
    cursor = get_collection().find({}).sort("created_at", -1)
    notices = []
    for notice in cursor:
        notice["id"] = str(notice.pop("_id"))
        notices.append(notice)
    return response(200, {"notices": notices})


def create_notice(body):
    title = str(body.get("title", "")).strip()
    message = str(body.get("message", "")).strip()

    if not title:
        return response(400, {"error": "title is required"})
    if not message:
        return response(400, {"error": "message is required"})

    notice = {
        "title": title,
        "message": message,
        "category": str(body.get("category", "General")).strip() or "General",
        "author": str(body.get("author", "Anonymous")).strip() or "Anonymous",
        "pinned": bool(body.get("pinned", False)),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    result = get_collection().insert_one(notice)
    notice["id"] = str(result.inserted_id)
    return response(201, {"notice": notice})


def update_notice(notice_id, body):
    if not ObjectId.is_valid(notice_id):
        return response(400, {"error": "Invalid notice id"})

    allowed = {"title", "message", "category", "author", "pinned"}
    updates = {key: value for key, value in body.items() if key in allowed}
    if not updates:
        return response(400, {"error": "No valid fields to update"})

    result = get_collection().update_one(
        {"_id": ObjectId(notice_id)},
        {"$set": updates},
    )
    if result.matched_count == 0:
        return response(404, {"error": "Notice not found"})
    return response(200, {"updated": notice_id})


def delete_notice(notice_id):
    if not ObjectId.is_valid(notice_id):
        return response(400, {"error": "Invalid notice id"})

    result = get_collection().delete_one({"_id": ObjectId(notice_id)})
    if result.deleted_count == 0:
        return response(404, {"error": "Notice not found"})
    return response(200, {"deleted": notice_id})


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        "body": json.dumps(body),
    }
