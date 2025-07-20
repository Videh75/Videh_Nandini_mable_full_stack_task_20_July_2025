# Mable Full Stack Developer Technical Task – July 2025

This is the submission for the Mable Full Stack Developer Technical Task, implemented by [Videh Nandini](https://github.com/Videh75). The project demonstrates a complete full-stack implementation of an e-commerce-style product library with user authentication, analytics tracking, and cart management.

---

## 🧩 Tech Stack

### Frontend (Remix)
- **Framework**: [Remix](https://remix.run/)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Event Tracking**: ClickHouse
- **Routing**: Remix routes-based file system
- **API Calls**: Axios

### Backend (Go)
- **Framework**: [Gin](https://gin-gonic.com/)
- **Database**: MongoDB (Users, Products), ClickHouse (Analytics)
- **Auth**: JWT-based authentication with secure cookies\

---

## 🧪 Features Implemented

### ✅ Frontend (Remix + Tailwind)
- Login & Signup pages
- Product library with “View” and “Add to Cart”
- Cart functionality with purchase flow
- State management using Zustand
- Analytics tracking with ClickHouse integration

### ✅ Backend (Golang + Gin)
- JWT-based authentication
- Secure cookie handling
- MongoDB for user & product storage
- ClickHouse for storing analytics events

---

## 📊 Event Tracking with ClickHouse

- Events like `lead_login`, `product_view`, `cart_add`, `purchase` are stored in ClickHouse.
- Tracked using a utility `trackEvent.ts` in the frontend.
- These events can be visualized in Grafana Cloud using a connected ClickHouse data source.

---

##  🚀 Getting started
### 1. Clone the repo

```bash
git clone https://github.com/Videh75/Videh_Nandini_mable_full_stack_task_20_July_2025.git
cd Videh_Nandini_mable_full_stack_task_20_July_2025
```

### 1. Backend setup
Create .env in api/cmd/api
```
PORT=
DB_URI=
DB_NAME=
DB_COLLECTION=
SECRET=
CLICKHOUSE_HOST=
CLICKHOUSE_DB=
CLICKHOUSE_USER=
CLICKHOUSE_PASS=
FRONTEND_URL=
GRAFANA_URL=
```

### 2. Run Backend
```
cd api
go run cmd/api/main.go
```

### 3. Run frontend
```
cd e-commerce
pnpm install
pnpm run dev
```

