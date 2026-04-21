# ShoeStore - E-Commerce Platform

ShoeStore is a small e-commerce application designed for footwear retail. Built with modern technologies, it offers a seamless experience for customers and sellers, featuring a modern UI and a secure backend.

## Features

- **Complete Shopping Flow**: Browse products, add to wishlist, manage shopping cart, and secure checkout.
- **Seller Dashboard**: Intuitive interface for sellers to manage product listings, track sales, and handle inventory.
- **Image Management**: Integrated local image upload system for product high-fidelity visuals.
- **Secure Authentication**: Robust security framework using Spring Security and JWT for both customers and sellers.
- **Order History**: Detailed tracking of past purchases for users to revisit their favorites.
- **Modern Design**: Beautiful, responsive UI built with Tailwind CSS 4 and Radix UI components.

## Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Core Framework**: [Spring Boot 4.0.4](https://spring.io/projects/spring-boot)
- **Language**: [Java 25](https://openjdk.org/)
- **Security**: Spring Security + JWT
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Persistence**: Spring Data JPA
- **Build Tool**: Maven

---

## Getting Started

### Prerequisites
- **Java 25** or higher
- **Node.js** (LTS version recommended)
- **PostgreSQL** instance
- **Maven** 3.9+

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create/Configure your environment variables in `.env`:
   ```properties
   DB_URL=jdbc:postgresql://localhost:5432/shoestore
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```
3. Install dependencies and build the project:
   ```bash
   mvn clean install
   ```
4. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will be available at `http://localhost:8081`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at the port specified by Vite (usually `http://localhost:5173`).

---

