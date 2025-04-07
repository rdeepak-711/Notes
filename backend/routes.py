from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId
from passlib.context import CryptContext

from .database import notes_collection, users_collection
from .models import Note, UsernameData, LoginCheck

router = APIRouter()

# POST request
@router.post("/notes/")
async def create_note(note: Note):
    # Convert the given note to dict and add timestamps
    note_dict = note.model_dump()
    note_dict["created_at"] = datetime.utcnow()
    note_dict["updated_at"] = datetime.utcnow()

    # Insert the note to database i.e. notes_collection
    result = await notes_collection.insert_one(note_dict)

    # Return the inserted note with ID
    return {**note_dict, "_id": str(result.inserted_id)}

# GET request
@router.get("/notes/user/{user}")
async def get_notes_by_user(user: str):
    notes_cursor = notes_collection.find({"user": user})
    notes = await notes_cursor.to_list(length=None)
    for note in notes:
        note["_id"] = str(note["_id"])
    return notes
@router.get("/notes/{note_id}")
async def get_note_id(note_id: str):
    note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    note["_id"] = str(note["_id"])
    return note

# PUT request
@router.put("/notes/{note_id}")
async def update_note(note_id: str, updated_data: dict):
    updated_fields = {key: value for key, value in updated_data.items() if key!="user"}
    updated_fields["updated_at"] = datetime.utcnow()

    result = await notes_collection.update_one(
        {"_id": ObjectId(note_id)}, {"$set": updated_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")

    update_note = await notes_collection.find_one({"_id": ObjectId(note_id)})
    update_note["_id"] = str(update_note["_id"])
    return update_note

# DELETE request
@router.delete("/notes/{note_id}")
async def delete_note_by_id(note_id: str):
    if not ObjectId.is_valid(note_id):
        raise HTTPException(status_code=404, detail="Invalid note ID format")
    
    result = await notes_collection.delete_one({"_id": ObjectId(note_id)})

    if result.deleted_count==0:
        raise HTTPException(status_code=404, detail="No note found with this ID")
    return {"message": "Note deleted successfully"}
@router.delete("/notes/user/{user}")
async def delete_note_by_user(user: str):
    result = await notes_collection.delete_many({"user": user})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User doesn't exist")
    
    return {"message": f"Deleted {result.deleted_count} notes for user {user}"}

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Username check - signup
@router.post("/signup")
async def signup(usernameData: UsernameData):
    print("Collections:", users_collection)
    try:
        existing_user = await users_collection.find_one({"username": usernameData.username})

        if existing_user:
            if existing_user["email"] == usernameData.email:
                return {"exists": True, "sameEmail": True}
            else:
                return {"exists": True, "sameEmail": False}
        else:
            hashed_password = pwd_context.hash(usernameData.password)
            await users_collection.insert_one({
                "username": usernameData.username,
                "email": usernameData.email,
                "password": hashed_password
            })

        return {"exists": False, "message" : "Signup successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# Username and password check - login
@router.post("/login")
async def login(usernameData: LoginCheck):
    db_user = await users_collection.find_one({"username": usernameData.username})

    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid username")
    
    if not pwd_context.verify(usernameData.password, db_user["password"]):
        raise HTTPException(status_code=400, detail="Invalid password")
    
    return {"message" : "Login successful", "username": usernameData.username}

# Test DB
@router.get("/test-db")
async def test_db():
    try:
        sample_user = await users_collection.find_one()
        return {"message": "Connected successfully!", "sample_user": sample_user}
    except Exception as e:
        return {"error": str(e)}