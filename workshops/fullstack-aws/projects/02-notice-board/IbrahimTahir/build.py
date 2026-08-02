import os
import shutil
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))
BUILD_DIR = os.path.join(ROOT, "backend", "_build")
ZIP_PATH = os.path.join(ROOT, "backend", "lambda.zip")
REQUIREMENTS = os.path.join(ROOT, "backend", "requirements.txt")
HANDLER = os.path.join(ROOT, "backend", "lambda_function.py")


def main():
    if os.path.exists(BUILD_DIR):
        shutil.rmtree(BUILD_DIR)
    os.makedirs(BUILD_DIR)

    subprocess.run(
        ["pip", "install", "-r", REQUIREMENTS, "-t", BUILD_DIR, "-q"],
        check=True,
    )
    shutil.copy(HANDLER, BUILD_DIR)

    if os.path.exists(ZIP_PATH):
        os.remove(ZIP_PATH)
    shutil.make_archive(ZIP_PATH[: -len(".zip")], "zip", BUILD_DIR)

    print(f"Built {ZIP_PATH}")


if __name__ == "__main__":
    main()
