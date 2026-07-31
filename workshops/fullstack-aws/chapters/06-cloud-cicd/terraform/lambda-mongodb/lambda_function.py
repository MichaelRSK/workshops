import json
import os
from pymongo import MongoClient

MONGO_HOST = os.environ["MONGO_HOST"]
MONGO_PORT = int(os.environ.get("MONGO_PORT", 27017))

def get_client():
    return MongoClient(host=MONGO_HOST, port=MONGO_PORT, serverSelectionTimeoutMS=5000)

def lambda_handler(event, context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    path   = event.get("rawPath", "/")

    print(f"Request: {method} {path}")

    client = get_client()
    db = client["company"]
    collection = db["employees"]

    # GET /employees
    if method == "GET" and path == "/employees":
        employees = list(collection.find({}, {"_id": 0}))
        return response(200, {"employees": employees})

    # POST /employees
    if method == "POST" and path == "/employees":
        body = json.loads(event.get("body") or "{}")
        name = body.get("name")
        role = body.get("role")

        if not name or not role:
            return response(400, {"error": "Missing 'name' or 'role'"})

        employee = {"name": name, "role": role}
        collection.insert_one(employee)
        employee.pop("_id", None)
        return response(201, {"created": employee})

    return response(404, {"error": f"Route not found: {method} {path}"})


def response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(body),
    }
