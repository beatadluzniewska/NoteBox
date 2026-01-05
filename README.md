# NoteBox – Task & Work Tracking Application

NoteBox is a full stack web application for managing task lists and tasks with priorities, deadlines, and progress tracking.  
The project was developed as part of a postgraduate program in Programming and Databases, with a strong focus on backend architecture, data consistency, and REST API design.

---

## ✨ Features

- Create, edit, and delete task lists
- Create, edit, and delete tasks within lists
- Assign priorities (high / medium / low)
- Set due dates for tasks
- Mark tasks as completed or open
- Automatic progress calculation per task list
- Visual progress indicator (percentage and progress bar)
- Search tasks by title
- Sort tasks by due date or priority
- Filter tasks by priority
- Automatic highlighting of tasks with deadlines ≤ 7 days
- Responsive web interface

---

## 🧱 Application Architecture

The application is built using a **layered architecture**, separating responsibilities across the frontend, backend, and database layers.

### Frontend
- Built with **React**
- Communicates with the backend via REST API
- Handles client-side features such as searching, sorting, and filtering
- Provides a responsive and user-friendly interface

### Backend
- Built with **Java and Spring Boot**
- Exposes a REST API
- Uses a layered structure:
  - Controllers
  - Services
  - Repositories
  - DTOs and Mappers
- Handles business logic, data validation, and relationships between entities

### Database
- **PostgreSQL** as the primary relational database
- **H2** database used for testing
- Data persisted with JPA and Hibernate

---

## 🔌 REST API Overview

The backend exposes a REST API that supports full CRUD operations.

### Task Lists
- `GET /api/task-lists`
- `POST /api/task-lists`
- `PUT /api/task-lists/{id}`
- `DELETE /api/task-lists/{id}`

### Tasks
- `GET /api/task-lists/{listId}/tasks`
- `POST /api/task-lists/{listId}/tasks`
- `PUT /api/task-lists/{listId}/tasks/{taskId}`
- `DELETE /api/task-lists/{listId}/tasks/{taskId}`

The API supports:
- assigning tasks to lists
- marking tasks as completed
- maintaining data consistency between related entities

---

## 🗂 Data Model

The system is based on two main entities:

### TaskList
- name
- description
- collection of tasks

### Task
- title
- description
- due date
- priority
- status (open / completed)

**Relationship:**  
One-to-many — one task list can contain many tasks, while each task belongs to exactly one list.

---

## 🧪 Testing

The backend was tested using:

- **H2 Database** – lightweight, in-memory database for test environment
- **JUnit** and **Spring Boot Test** – unit and integration testing

Tests were executed in isolation from the production database and helped identify issues related to:
- date handling
- entity relationships
- data mapping consistency

---

## 🚀 Running the Application Locally

### Requirements
- Docker & Docker Compose
- Node.js & npm
- Java (JDK)

### Backend (Docker)
1. Open Docker
2. Run:
   ```bash
   docker-compose up
3. Alternatively, run the backend directly from IntelliJ IDEA using the Run configuration.

### Frontend
1. Navigate to the frontend directory:

```cd frontend

2. Install dependencies and start the app:

```npm install
```npm run dev

### 📘 How to Use the Application

1. Open the application and navigate to the **Task Lists** view.
2. Click **Create New Task List** to add a new category.
3. Select a list and click **Add Task**.
4. Provide the following details:
   - title
   - optional description
   - priority
   - due date
5. Save to add the task to the list.

### Managing Tasks
- Edit or delete tasks
- Mark tasks as completed or open
- Use search to find tasks by title
- Sort tasks by due date or priority
- Filter tasks by priority level

Progress is displayed visually as a **percentage and progress bar**.  
Deleting a task list removes all associated tasks (**cascade delete**).

---

### 🛠 Tech Stack

**Backend:**  
Java · Spring Boot · Spring Data JPA

**Database:**  
PostgreSQL · H2

**Frontend:**  
React

**API:**  
REST

**Containerization:**  
Docker · Docker Compose

**Testing:**  
JUnit · Spring Boot Test

**Styling:**  
CSS

---

### 📌 Project Scope

- Single-user application (no authentication)
- Focus on core CRUD functionality and clean architecture
- Developed iteratively, starting from an MVP and expanded with additional features

---

### 📄 License

This project was created for educational and portfolio purposes.
