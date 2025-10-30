# MessMate

Smart mess management system that lets students redeem meals with QR codes while administrators manage credits, scan codes, and review transactions in real time.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, React Router, QRCode, QR Scanner
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication
- **Tooling:** Nodemon (dev), Axios, dotenv

## Project Structure

```
messmate/
 ┣ backend/
 ┃ ┣ controllers/
 ┃ ┣ middleware/
 ┃ ┣ models/
 ┃ ┣ routes/
 ┃ ┣ utils/
 ┃ ┣ config/
 ┃ ┣ server.js
 ┃ ┗ package.json
 ┣ frontend/
 ┃ ┣ src/
 ┃ ┣ index.html
 ┃ ┗ package.json
 ┗ README.md
```

## Prerequisites

- Node.js 18+
- npm 9+
- MongoDB instance (local or hosted)

## Environment Variables

Create `.env` files using the provided examples.

**Backend (`backend/.env`):**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=messmate
JWT_SECRET=replace_with_strong_secret
NODE_ENV=development
```

**Frontend (`frontend/.env`):**

```
VITE_API_URL=http://localhost:5000/api
```

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running Locally

Open two terminals:

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

- Backend runs on `http://localhost:5000`
- Frontend runs on `http://localhost:5173`

## API Overview

| Method | Endpoint | Description | Auth |
| ------ | -------- | ----------- | ---- |
| POST | `/api/users/register` | Register student | Public |
| POST | `/api/users/login` | Login and issue JWT | Public |
| GET | `/api/users/profile` | Fetch current profile | User |
| GET | `/api/users/transactions` | List user transactions | User |
| POST | `/api/admin/scan` | Deduct credits via QR data | Admin |
| GET | `/api/admin/users` | List users and balances | Admin |
| PUT | `/api/admin/credits` | Adjust user credits | Admin |
| GET | `/api/admin/transactions/:userId` | Transaction history for user | Admin |

## First Admin Account

Create an admin user manually in MongoDB or extend the API to seed an admin. Update the `role` field to `admin` to access admin routes.

## Testing the QR Flow

1. Register a student via the frontend or API.
2. Copy the generated QR data from the student dashboard.
3. Visit `/admin/scanner` (requires admin login) and scan the QR code using a second device or upload the code via the emulator.
4. Validate that credits deduct and the transaction list updates.

## Deployment Notes

- Configure environment variables on the hosting platform (Render, Railway, etc.).
- Enable CORS for production domains in `backend/server.js` if deploying to separate origins.
- Consider enabling HTTPS and secure cookies for JWT storage in production.

## License

MIT
