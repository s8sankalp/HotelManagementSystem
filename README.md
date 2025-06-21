# Hotel Management System

This is a full-stack Hotel Management System built with Java Spring Boot and React.js.

## Tech Stack

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- MySQL
- Swagger UI

**Frontend:**
- React.js
- React Router
- Axios

## Features

- User authentication (Admin, Customer roles) with JWT.
- Room availability search.
- Room booking and cancellation.
- Room management (CRUD for admins).
- Customer management (to be implemented).
- Mock payment process (to be implemented).
- Simple NLP-based chatbot for answering FAQs.

## How to Run Locally

### Backend
1.  Navigate to the `backend` directory.
2.  Make sure you have a MySQL instance running.
3.  Update the database credentials in `src/main/resources/application.properties`.
4.  Run the application using `./mvnw spring-boot:run`.
5.  The backend will be running on `http://localhost:8080`.
6.  Swagger UI is available at `http://localhost:8080/swagger-ui/index.html`.

### Frontend
1.  Navigate to the `frontend` directory.
2.  Run `npm install` to install dependencies.
3.  Run `npm start` to start the development server.
4.  The frontend will be running on `http://localhost:3000`.

## API Structure

The backend exposes RESTful APIs for various functionalities. The main endpoints are:
- `/api/auth/**`: For user authentication.
- `/api/rooms/**`: For room management and viewing.
- `/api/bookings/**`: For booking and cancellation.
- `/api/chatbot/**`: For the chatbot.

## Chatbot

The chatbot is a simple rule-based system that can answer basic questions. It is available on all pages and can be opened by clicking the "Chat" button.

**Sample queries:**
- "I want to book a room"
- "What time is check-in?"
- "How can I cancel my booking?"
- "Need help" 