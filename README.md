# 📚 Library Management System (MERN)

A modern full-stack Library Management System built with the **MERN** stack (MongoDB, Express, React, Node.js) featuring a beautiful **Neomorphism** UI with light/dark mode support.

## ✨ Features

1. **Borrow Tracking** – See which student has which book
2. **Due Dates & Email Reminders** – Track days remaining; send reminder emails to return/reissue within 15 days
3. **Important Links & Resources** – NPTEL, SWAYAM, IEEE Xplore, Delnet, etc.
4. **Seat Occupancy** – Live view of which seats are occupied, by whom, and until when
5. **Modern Icons** – Lucide React icons throughout
6. **Neomorphism UI** – Soft light/dark mix design with smooth theme toggle
7. **Events** – Upcoming and past library events
8. **Library Staff** – Head Librarian, Assistant, and team details
9. **College Websites** – All active institutional portals in one place
10. **MERN Stack** – Production-ready structure
11. **QR / Barcode Scanning** – Camera + USB scanner for:
    - Adding books (scan ISBN / barcode)
    - Issuing books (scan book → scan student library card)
    - Returning books
    - Looking up books & students
    - Dedicated **Scan Center** page

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18 + Vite + Tailwind CSS      |
| Icons     | Lucide React                        |
| Scanner   | html5-qrcode (camera + USB)         |
| Backend   | Node.js + Express                   |
| Database  | MongoDB + Mongoose                 |
| Email     | Nodemailer                          |
| Styling   | Neomorphism (custom CSS + Tailwind) |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env – set MONGO_URI (and optional SMTP for real emails)
npm install
npm run seed    # Populate sample data
npm run dev     # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev     # Starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## 📧 Email Configuration (Optional)

To send real reminder emails, add to `backend/.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Library" <library@college.edu>
```

Without SMTP config, email actions still work in the UI (logged to console).

## 📁 Project Structure

```
library-management-system/
├── backend/
│   ├── config/db.js
│   ├── controllers/
│   ├── models/          # Book, Student, Borrow, Seat, Event, Staff, Resource, Website
│   ├── routes/
│   ├── utils/email.js
│   ├── seed.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/
        ├── components/  # Sidebar, Header
        ├── pages/       # Dashboard, Borrowings, Books, Seats, Events, Staff, Resources, Websites
        └── index.css    # Neomorphism styles
```

## 🎨 UI Highlights

- Soft neomorphic cards, buttons, and inputs
- Light / Dark mode toggle (persisted)
- Responsive sidebar navigation
- Status badges (issued / overdue / returned / occupied)
- Clean data tables and card grids

## 📋 API Endpoints

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/books                | List books               |
| GET    | /api/students             | List students            |
| GET    | /api/borrows              | List borrow records      |
| POST   | /api/borrows/issue        | Issue a book + email     |
| PUT    | /api/borrows/:id/return   | Return a book            |
| POST   | /api/borrows/:id/remind   | Send reminder email      |
| PUT    | /api/borrows/:id/reissue  | Reissue (+15 days)       |
| GET    | /api/seats                | Seat occupancy           |
| GET    | /api/events               | Library events           |
| GET    | /api/staff                | Staff directory          |
| GET    | /api/resources            | Learning resources       |
| GET    | /api/websites             | College websites         |

---

Built with ❤️ using MERN + Neomorphism design.
