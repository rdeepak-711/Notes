# Notes App - FastAPI + ReactJS + MongoDB

A full-stack Notes web application built with:

- ⚙️ **FastAPI** (Python backend)
- 💻 **ReactJS** (Frontend)
- 🛢️ **MongoDB Atlas** (Cloud NoSQL Database)
- 🐳 Previously local DB in Docker, now fully online
- 🌐 CORS & environment configuration included

---

## 📁 Project Structure

Personal-notes├── frontend/ # React.js app │ ├── src/ │ ├── public/ │ └── .env │ ├── backend/ # FastAPI app │ ├── main.py │ ├── routes/ │ ├── .env │ └── requirements.txt │ ├── README.md └── .gitignore


---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js + npm
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- (Optional: Docker if setting up local DB for testing)

---

## 🔧 Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt

# .env file setup
# .env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>
CLIENT_ORIGIN=http://localhost:3000

# Run the server
uvicorn main:app --reload

## 💻 Frontend Setup (ReactJS)
cd frontend
npm install

# .env setup
REACT_APP_API_URL=http://localhost:8000

# Run the app
npm start


Features
🔐 User Signup with hashed passwords
✉️ Email + Username verification
📝 Notes storing and retrieval
📦 MongoDB Atlas cloud storage
🔄 Fast CORS-compatible communication
🧪 Built-in Swagger docs (/docs)
