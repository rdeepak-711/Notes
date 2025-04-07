from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MongoDB_Connection_String = os.getenv("MONGODB_URI")

MongoDB_Client = AsyncIOMotorClient(MongoDB_Connection_String)

database = MongoDB_Client.fastapi_notes_db

notes_collection = database.notes
users_collection = database.users