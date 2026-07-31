class NoticeService:
    def __init__(self, repository):
        self._repository = repository

    def get_notices(self):
        return self._repository.get_all()

    def create_notice(self, name, message):
        if not isinstance(name, str) or not name.strip():
            raise ValueError("name is required")

        if not isinstance(message, str) or not message.strip():
            raise ValueError("message is required")

        return self._repository.create(name.strip(), message.strip())

    def delete_notice(self, notice_id):
        return self._repository.delete(notice_id)
