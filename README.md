# Tic-Tac-Toe SaaS Service

**Author:** Carles Sánchez Moreno 

**Stack:** Kotlin (Spring Boot) + React + TypeScript + H2 Database  

---

## 📋 Project Description

This project is a preliminary implementation of an **Tic-Tac-Toe SaaS service** following the VW Digital Hub technical test.  
It allows creating users, login, creating matches, making moves and checking the board status.

---

## ⚙️ Technical Requirements

- **Backend:** Kotlin, Spring Boot, H2 database (in-memory, for ease of testing), logger implemented.  
- **Frontend:** React with TypeScript, DDD structure, tests implemented.  
- **Main API Endpoints:**
  - `POST /api/match/create` → Creates a new match.
  - `POST /api/match/move` → Makes a move in a match.
  - `GET /api/match/status?matchId={matchId}` → Retrieves the current status of a match.
  - `GET /api/match/player/{playerId}/matches` → Retrieves the current matches of a player.
  - `POST /api/player/login` → User login.
  - `POST /api/player/register` → User registration.

---

## 🏗 Architecture & Design

- **Clean Architecture** applied for separation of layers (domain, service, repository, controller).  
- **DDD (Domain-Driven Design)** for both frontend and backend.  
- Logger implemented for **Monitoring and Observability** (using `stderr` with appropriate log levels).  
- Scalable and testable code, prepared for unit and integration testing.  
- Repositories configured for **dev**, **pre**, **pro** environments.  

---

## 📦 Setup & Deployment

### Backend

### Backend

1. Download the repository and open the backend project in an IDE (e.g., IntelliJ).  
2. Run the application normally from the IDE.  
3. The server will start on **port 8585** automatically.  
4. No additional configuration is required; the backend uses an **H2 in-memory database** for easy testing.

### Frontend

1. Download the repository and open the frontend project in your IDE.  
2. Install dependencies:
```bash
npm install
````
To run the project 

```` bash
npm run dev
````

## ⚙️ Environment Requirements

### Backend
- **Java 17** or higher
- IDE: IntelliJ, Eclipse, or similar

### Frontend
- **Node.js 18+**
- **npm 9+**
- Modern browser (Chrome, Firefox, Edge)

### 🧪 Tests


#### Backend

- **Frameworks** : JUnit and Mockito

```bash
mvn test
````

#### Frontend


- **Frameworks** : Vitest

```bash
npm run test
````


## 📝 Technical Decisions & Implementation Details

### Game Rules Enforcement:

- Player X always starts the match.
- Machine plays as O and automatically selects and empty square randomly.
- H2 in-memory database is used **only for testing and development**; for production, PostgreSQL or MySQL should be configured.  
- Invalid moves (occupied square, wrong turn, or out-of-bounds) do not affect the game state.

### Logging and Monitoring

- Backend logs all actions using stderr with appropriate log levels (INFO, DEBUG, ERROR).

- Logs include player moves, machine moves, match creation, errors, and status updates.

- Designed for Observability and Monitoring in line with 12-factor app principles.

### Architecture & Code Quality:

- Clean Architecture separates layers: Controller, Service, Repository, Domain.

- DDD (Domain-Driven Design) applied to both backend and frontend.

- Scalable and maintainable code using SOLID principles.

- Fully unit-tested backend and frontend components.

### Database:

- H2 in-memory database used for simplicity and quick testing.

- Entities include User, Match, and Square.

- Relationships: a User can have multiple Matches; a Match contains multiple Squares.

### Frontend Design:

- React application with TypeScript and modular structure.

- Responsive design compatible with desktop and mobile.

- Clear UI for creating matches, making moves, and displaying match status.

## 🚀 Future Improvements & User Management

### User Management Enhancements:

- JWT-based authentication for secure login.

- Role-based access control (admin vs player).

- Endpoints: PUT /users/{id}, DELETE /users/{id}.

- Possibility of recovering unfinished matches to finish them

### Game Enhancements:

- Machine AI with smarter strategies instead of random moves.

- Multiplayer support for real-time gameplay with WebSockets.

- Persistent database for production environment (PostgreSQL or MySQL).

- Optional Dockerization for easier deployment and environment consistency.

## 📂 API Examples

### Create a match

```bash
POST /api/match/create
Response:
{
  "matchId": 1
}
````

### Make a move

```bash
POST /api/match/move
{
  "matchId": 1,
  "playerId": "X",
  "square": { "x": 1, "y": 2 }
}

Response:

{
  "matchId": 1,
  "board": [
    { "x":1, "y":1, "square_value": null },
    { "x":1, "y":2, "square_value": "X" },
    ...
  ],
  "currentTurn": "O",
  "status": "IN_PROGRESS",
  "error": null
}

````

### Get status

```bash
GET /api/match/status?matchId=1
Response:
{
    "matchId": 1,
    "playerTurn": "X",
    "status": "IN_PROGRESS",
    "squares": [...]
}

````

### Get all player matches

```bash
GET /api/match/player/1/matches
Response:

{
    "id": 1,
       "player": {
           "id": 1,
           "username": "admin",
           "email": "admin@admin.com"
    },
        "squares": [...],
        "currentTurn": "X",
        "status": "IN_PROGRESS"
}


````

### Register

```bash
POST /api/player/register
{
    "username" : "admin",
    "password" : "12345",
    "email" : "admin@gmail.com"  
}

Response:

{
    "id": 1,
    "username": "admin2",
    "email": "admin2@gmail.com"
}
````

### Login

```bash
POST /api/player/login
{
    "username" : "admin",
    "password" : "admin" 
}

Response:

{
    "id": 1,
    "username": "admin",
    "email": "admin@gmail.com"
}
````

