# 🏦 BankApp Fullstack

A production-ready Full Stack Bank Management System built with Spring Boot and React.

## 🛠️ Tech Stack

### Backend
- Java 17 + Spring Boot 3.2
- Spring Security + JWT Authentication
- Spring Data JPA + MySQL
- Maven

### Frontend
- React 18 + Vite
- Tailwind CSS
- Axios + React Router v6
- Recharts

## 🚀 Features

- ✅ User Registration & Login (JWT)
- ✅ Open / Close Bank Accounts
- ✅ Deposit & Withdrawal
- ✅ Fund Transfer between accounts
- ✅ Transaction History
- ✅ Admin Dashboard
- ✅ Role-based Access (Admin / Customer)
- ✅ Responsive UI + Dark Mode

## 📁 Project Structure

```text
bankapp-fullstack/
├── backend/          # Spring Boot REST API
└── frontend/         # React Application
```

## ⚙️ Setup & Run

### Backend

```bash
cd backend
cp src/main/resources/application.properties.example src/main/resources/application.properties
# Edit application.properties with your DB credentials
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login | Login |
| POST   | /api/accounts/open | Open account |
| GET    | /api/accounts/my | My accounts |
| POST   | /api/transactions/deposit | Deposit |
| POST   | /api/transactions/withdraw | Withdraw |
| POST   | /api/transactions/transfer | Transfer |
| GET    | /api/transactions/{accountNo} | History |

## 👤 Author

**Sumiran Paparkar**
- GitHub: [@sumiran3031](https://github.com/sumiran3031)
- LinkedIn: [sumiran-paparkar](https://linkedin.com/in/sumiran-paparkar)
