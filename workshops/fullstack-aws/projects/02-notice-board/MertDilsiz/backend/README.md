# Notice Board Backend (Flask)

This backend provides a REST API for notices using MongoDB Atlas.

## Project Structure

- app.py: Flask app initialization and CORS setup
- routes/: HTTP API routes
- services/: Business logic
- database/: Data access layer
- database/mongodb.py: MongoDB Atlas connection and database loader

## Setup

1. Create and activate a virtual environment.
2. Install dependencies:
   pip install -r requirements.txt
3. Create a .env file in backend/ using .env.example:
   cp .env.example .env
4. Edit .env and set your MongoDB Atlas connection string:
   MONGO_URI=your_mongodb_atlas_connection_string
   MONGO_DB=Noticeboard
5. Run the server:
   python app.py

Server default URL: http://localhost:5001

## MongoDB Setup

- Database: Noticeboard
- Collection: notices

Each notice is stored as:

- name (string)
- message (string)

## API Endpoints

GET /notices

- Returns all notices.
- Reads from Noticeboard.notices.
- Response format:
  [
  {
  "id": "mongodb_object_id",
  "name": "...",
  "message": "..."
  }
  ]

POST /notices

- Creates a notice.
- Request body:
  {
  "name": "Mert",
  "message": "My notice message"
  }
- Inserts into Noticeboard.notices.

DELETE /notices/<id>

- Deletes a notice by ID.
- Converts id to MongoDB ObjectId and deletes the matching document.
