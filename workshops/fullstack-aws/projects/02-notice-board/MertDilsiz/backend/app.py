from flask import Flask, jsonify
from flask_cors import CORS

from routes.notices import notices_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(notices_bp)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
