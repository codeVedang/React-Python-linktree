Full-Stack Link-Sharing Application
<p align="center">
<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
<img src="https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
</p>

A secure, multi-user link-sharing application built with a React frontend and a Python (Flask) backend. This project allows users to register, log in, and manage a personal list of shareable links, similar to services like Linktree.

A placeholder image of the application's interface. Replace with a real screenshot.

🚀 Key Features
Secure User Authentication: Users can register and log in. Passwords are securely hashed using bcrypt, and sessions are managed using JSON Web Tokens (JWT).

Full CRUD Functionality: Users can Create, Read, Update, and Delete their own links after logging in.

Protected API Routes: The backend API ensures that users can only access and modify their own data.

Responsive Frontend: A clean, modern user interface built with React and styled with Tailwind CSS.

🛠️ Tech Stack
Backend:

Language: Python 3

Framework: Flask

Database: SQLite (via Flask-SQLAlchemy)

Authentication: Flask-JWT-Extended, Flask-Bcrypt

Frontend:

Library: React (Functional Components & Hooks)

Styling: Tailwind CSS

State Management: React Hooks (useState, useEffect)

⚙️ Getting Started / Local Development
To run this project on your local machine, you will need two separate terminal windows.

Prerequisites
Python 3 installed

Node.js and npm installed

1. Backend Setup
# 1. Navigate to the main project directory
cd /path/to/your/project

# 2. Install Python dependencies
pip install Flask Flask-SQLAlchemy Flask-Cors Flask-Bcrypt Flask-JWT-Extended

# 3. Run the Flask server using the recommended command
# (This command is more reliable than `python app.py`)
python -m flask run

The backend server will now be running on http://127.0.0.1:5000.

2. Frontend Setup
# 1. In a new terminal, navigate to the frontend directory
cd /path/to/your/project/frontend

# 2. Install all npm packages
npm install

# 3. Run the React development server
npm start

The application will automatically open in your browser at http://localhost:3000.

🗺️ API Endpoints
The backend exposes the following RESTful API endpoints:

Method

Endpoint

Description

Access

POST

/register

Register a new user.

Public

POST

/login

Log in a user and get a token.

Public

GET

/api/links

Get all links for the user.

Private

POST

/api/links

Create a new link.

Private

PUT

/api/links/<id>

Update an existing link.

Private

DELETE

/api/links/<id>

Delete a link.

Private

🌟 Future Improvements
Refactor Frontend State: Implement React's Context API or a state management library like Zustand to handle global authentication state more cleanly.

Split UI into Components: Break down the App.js file into smaller, reusable components (e.g., LinkList, AddLinkForm, AuthPage).

Organize Backend with Blueprints: Refactor the Flask backend to use Blueprints, separating authentication logic from link management logic for better scalability.

Add Public Profile Pages: Create a public-facing route like /<username> that displays a user's links to anyone.
