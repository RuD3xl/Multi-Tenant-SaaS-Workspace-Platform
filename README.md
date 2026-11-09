# Multi-Tenant SaaS Workspace Platform

A full-stack pet project built with Spring Boot and React to practice modern web development, API design, and multi-tenant architecture.

## About the Project & Current Status

This project aims to simulate a real-world SaaS environment where users can create isolated workspaces (organizations), manage team members with specific roles, and organize projects securely.

Currently, the **Backend API is mostly fully implemented**. It successfully handles complex business logic, including stateless JWT authentication, organization-level data isolation (using custom Spring Interceptors), Role-Based Access Control (RBAC), and detailed global exception handling (`@RestControllerAdvice`).

The **Frontend is in active development**. The foundational SPA architecture is already up and running. This includes client-side routing, protected layouts, the complete authentication flow, and Axios interceptors for automatic token management and dynamic error parsing.

**What I am building next:**
- A workspace context switcher in the UI to seamlessly navigate between different organizations.
- A team management interface to invite new members and assign roles.
- A functional dashboard view to manage organization-specific projects.

## Tech Stack

**Backend:**
- Java 17+
- Spring Boot 3
- Spring Security (JWT Auth)
- PostgreSQL
- Hibernate / Spring Data JPA

**Frontend:**
- React 18 (SPA)
- TypeScript
- Vite
- Tailwind CSS
- React Router & Axios

## How to Run Locally

### Backend
1. Configure your PostgreSQL credentials in `src/main/resources/application.yml`.
2. Run the Spring Boot application (it will start on `http://localhost:8080`).

### Frontend
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open `http://localhost:5173` in your browser.