# Import the notice models here so "from app.models import NoticeOut" works
# from anywhere in the app, rather than every caller having to know which
# file inside the package a given model lives in.
#
# That matters more than it looks. Splitting notice.py into two files later,
# or renaming it, then only changes this line instead of every import across
# the services and controllers.
from app.models.notice import NoticeCreate, NoticeOut

# Names re-exported from this package. __all__ is what "from app.models
# import *" would pick up, and it doubles as the list of what this package
# is meant to expose.
__all__ = [
    "NoticeCreate",
    "NoticeOut",
]
