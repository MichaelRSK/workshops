from flask import Blueprint, jsonify, request

from database.notice_repository import NoticeRepository
from services.notice_service import NoticeService


notices_bp = Blueprint("notices", __name__)
notice_service = NoticeService(NoticeRepository())


@notices_bp.get("/notices")
def get_notices():
    notices = notice_service.get_notices()
    return jsonify(notices), 200


@notices_bp.post("/notices")
def create_notice():
    payload = request.get_json(silent=True) or {}

    try:
        notice = notice_service.create_notice(
            payload.get("name"),
            payload.get("message"),
        )
    except ValueError as error:
        return jsonify({"error": str(error)}), 400

    return jsonify(notice), 201


@notices_bp.delete("/notices/<notice_id>")
def delete_notice(notice_id):
    deleted = notice_service.delete_notice(notice_id)

    if not deleted:
        return jsonify({"error": "notice not found"}), 404

    return jsonify({"message": "notice deleted"}), 200
