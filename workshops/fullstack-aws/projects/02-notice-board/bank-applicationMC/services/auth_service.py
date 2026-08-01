import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import jwt
from jwt import InvalidTokenError
from pwdlib import PasswordHash

from models.user import User


class AuthenticationError(ValueError):
    pass


class AuthService:
    def __init__(self, user_repository):
        self.user_repository = user_repository
        self.password_hash = PasswordHash.recommended()

    @staticmethod
    def normalize_email(email):
        return email.strip().lower()

    def register(self, name, email, password):
        normalized_name = name.strip()
        normalized_email = self.normalize_email(email)

        if not normalized_name:
            raise ValueError("Name is required")
        if "@" not in normalized_email or normalized_email.startswith("@"):
            raise ValueError("A valid email is required")
        if len(password) < 12:
            raise ValueError("Password must be at least 12 characters")
        if self.user_repository.get_by_email(normalized_email) is not None:
            raise ValueError("Email is already registered")

        user = User(
            name=normalized_name,
            email=normalized_email,
            password_hash=self.password_hash.hash(password),
        )
        return self.user_repository.save(user)

    def authenticate(self, email, password):
        user = self.user_repository.get_by_email(self.normalize_email(email))
        if user is None or not user.password_hash:
            raise AuthenticationError("Incorrect email or password")
        if not self.password_hash.verify(password, user.password_hash):
            raise AuthenticationError("Incorrect email or password")
        return user

    @staticmethod
    def _jwt_settings():
        secret = os.getenv("JWT_SECRET_KEY")
        if not secret:
            secret_file = Path(__file__).resolve().parent.parent / ".jwt-secret"
            if secret_file.is_file():
                secret = secret_file.read_text(encoding="utf-8").strip()
        if not secret or len(secret) < 32:
            raise RuntimeError(
                "Set JWT_SECRET_KEY or create .jwt-secret with at least 32 characters"
            )
        return {
            "secret": secret,
            "algorithm": os.getenv("JWT_ALGORITHM", "HS256"),
            "issuer": os.getenv("JWT_ISSUER", "bank-application"),
            "audience": os.getenv("JWT_AUDIENCE", "bank-application-api"),
            "minutes": int(os.getenv("JWT_ACCESS_TOKEN_MINUTES", "15")),
        }

    def create_access_token(self, user):
        settings = self._jwt_settings()
        now = datetime.now(timezone.utc)
        payload = {
            "sub": str(user.user_id),
            "type": "access",
            "iat": now,
            "exp": now + timedelta(minutes=settings["minutes"]),
            "iss": settings["issuer"],
            "aud": settings["audience"],
        }
        return jwt.encode(payload, settings["secret"], algorithm=settings["algorithm"])

    def get_user_from_token(self, token):
        settings = self._jwt_settings()
        try:
            payload = jwt.decode(
                token,
                settings["secret"],
                algorithms=[settings["algorithm"]],
                issuer=settings["issuer"],
                audience=settings["audience"],
                options={"require": ["sub", "exp", "iat", "iss", "aud"]},
            )
            if payload.get("type") != "access":
                raise AuthenticationError("Invalid token type")
            user_id = int(payload["sub"])
        except (InvalidTokenError, KeyError, TypeError, ValueError) as error:
            raise AuthenticationError("Invalid or expired access token") from error

        user = self.user_repository.get_by_id(user_id)
        if user is None:
            raise AuthenticationError("User no longer exists")
        return user
