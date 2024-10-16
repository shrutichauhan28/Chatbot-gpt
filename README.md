


---

# Project Name

This project consists of three main components:

1. **app**: FastAPI-based backend
2. **chat-backend**: Backend for authentication and authorization
3. **chat-frontend**: React-based frontend for the chat application

## Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [1. Setup FastAPI App](#1-setup-fastapi-app)
  - [2. Setup Chat Backend (Authorization)](#2-setup-chat-backend-authorization)
  - [3. Setup Chat Frontend (React)](#3-setup-chat-frontend-react)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Running Tests](#running-tests)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is divided into three main folders:

```
/app               # FastAPI backend for the core app
/chat-backend      # Backend for authentication and authorization services
/chat-frontend     # React-based frontend for chat functionality
```

### `/app` - FastAPI Backend

This folder contains the core backend of the application, built using FastAPI. It handles requests, processes data, and provides APIs for the frontend.

### `/chat-backend` - Authentication and Authorization

This folder contains backend services for authentication and authorization, handling user login, registration, and access control. It’s separate from the main app backend to allow for better modularity.

### `/chat-frontend` - React Frontend

This folder contains the chat frontend built using React. It provides the user interface for the chat application, interacting with both the FastAPI backend and the authentication backend.

## Prerequisites

- **Python 3.8+** (for FastAPI app and chat-backend)
- **Node.js 14+** (for chat-frontend)
- **Docker** (Optional, for containerized deployment)

## Setup Instructions

### 1. Setup FastAPI App

Navigate to the `app` directory:

```bash
cd app
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Run the FastAPI server locally:

```bash
uvicorn app:app --reload
```

The API will be running at `http://127.0.0.1:8000`.

### 2. Setup Chat Backend (Authorization)

Navigate to the `chat-backend` directory:

```bash
cd ../chat-backend
```

Install the dependencies:

```bash
npm install
```

Run the authentication backend:

```bash
npm start
```

### 3. Setup Chat Frontend (React)

Navigate to the `chat-frontend` directory:

```bash
cd ../chat-frontend
```

Install the Node.js dependencies:

```bash
npm install
```

Run the React development server:

```bash
npm start
```

The chat frontend will be running at `http://localhost:3000`.

## API Endpoints

### FastAPI Backend

- **GET** `/users`: Fetch all users
- **POST** `/messages`: Send a message
- **GET** `/messages`: Fetch all messages

### Chat-Backend (Authentication)

- **POST** `/auth/register`: Register a new user
- **POST** `/auth/login`: User login
- **POST** `/auth/refresh-token`: Refresh JWT token

### Chat Frontend

The frontend interacts with the FastAPI backend for sending and receiving messages and with the chat-backend for authentication.

## Technologies Used

- **Backend**: FastAPI, Python, Uvicorn, SQLAlchemy
- **Authentication**: FastAPI, JWT, OAuth2
- **Frontend**: React, JavaScript, Axios
- **Database**:Milvus(Vector Dtabase), MongoDB
- **State Management**: React Context API
- **Docker**: For containerized development 

