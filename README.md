# Nexora 💬

### Connect, Chat & Call

🌐 Live Demo: https://nexora-messenger.vercel.app

Nexora is a real-time communication application that helps people connect with others, build friendships, exchange messages, and communicate through video calls—all in one place.

I built Nexora to bring essential communication features together in a simple and user-friendly interface. Users can discover people, send friend requests, manage their profiles, chat in real time, and connect through video calls.

## ✨ Features

### 🔐 1. User Authentication

Users can create an account and log in securely to access the application.

* User registration and login
* Password hashing
* JWT-based authentication
* Protected routes for authenticated users
* Cookie-based authentication

### 👤 2. Personalized User Profiles

Users can create a profile and share information about themselves.

* Complete the onboarding process
* Add personal and profile information
* Set a profile picture
* Customize the information displayed on their profile

### 🔎 3. Discover and Connect with People

Nexora helps users find and connect with other people on the platform.

* Discover other registered users
* Explore potential connections
* Send friend requests
* Accept incoming friend requests
* Build a list of friends

### 💬 4. Real-Time Messaging

Users can communicate with their friends through real-time chat.

* Send and receive messages
* Exchange messages without manually refreshing the page
* Access the chat interface
* Use Stream Chat to power messaging functionality

### 📹 5. Video Calling

Nexora allows users to communicate face-to-face through video calls.

* Start video calls
* Join calls with other users
* Communicate using audio and video
* Use Stream Video to power calling functionality

Camera and microphone access depend on browser permissions and device availability.

### 🔔 6. Friend Request Notifications

Users can view incoming friend requests and respond to them.

* View received friend requests
* Check request-related notifications
* Accept friend requests

**Current limitation:** Rejecting friend requests is not currently supported.

### 🎨 7. Responsive User Interface

The frontend provides a modern interface for navigating the application's features.

* React-based user interface
* Tailwind CSS styling
* daisyUI components
* Theme selection
* Reusable UI components
* React Router-based page navigation

### 🔒 8. Backend and Data Management

The backend handles authentication, user information, API requests, and database operations.

* REST API built with Express.js
* MongoDB database integration
* Mongoose models
* Authentication middleware
* Input validation
* Security middleware

### 🧪 9. Automated Testing

The project includes automated tests for selected frontend and backend functionality.

* Backend API tests
* Frontend component tests
* Utility function tests
* ESLint-based code checking
* Production build verification

Automated tests do not replace manual testing of real-time messaging and video calling with valid Stream credentials.

---

## 🛠️ Tech Stack

| Category        | Technologies                                      |
| --------------- | ------------------------------------------------- |
| Frontend        | React 19, Vite                                    |
| Styling         | Tailwind CSS, daisyUI                             |
| Data Fetching   | React Query                                       |
| Backend         | Node.js, Express.js                               |
| Database        | MongoDB, Mongoose                                 |
| Authentication  | JWT, HTTP cookies, bcrypt                         |
| Real-Time Chat  | Stream Chat                                       |
| Video Calling   | Stream Video                                      |
| Testing         | Vitest, React Testing Library, backend test suite |
| Version Control | Git, GitHub                                       |

## 📁 Project Structure

```text
Nexora/
├── backend/
│   ├── scripts/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ How Nexora Works

Nexora uses a frontend, a backend API, a database, and Stream's communication services.

1. **User interaction:** Users interact with the React frontend to register, log in, discover people, and use communication features.
2. **API requests:** The frontend communicates with the Express backend for application data and authentication.
3. **Authentication:** The backend verifies user credentials and manages authentication using JWT and cookies.
4. **Database operations:** MongoDB stores application data, including user information and friend-request records.
5. **Real-time communication:** Stream Chat and Stream Video provide messaging and video-calling functionality.

This architecture separates the user interface, application logic, data storage, and communication services.

---

## 🚀 Getting Started

Follow these steps to run Nexora on your local machine.

### Prerequisites

Make sure you have:

* Node.js 20 or later
* npm
* MongoDB running locally or a MongoDB Atlas account
* A Stream account with an application configured for chat and video

### 1. Clone the Repository

```bash
git clone https://github.com/CodeByAkib/Nexora--video-calling-and-real-time-chat-application.git
cd Nexora--video-calling-and-real-time-chat-application
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure the following variables:

```env
PORT=5001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_random_jwt_secret
STREAM_API_KEY=your_stream_public_api_key
STREAM_API_SECRET=your_stream_private_api_secret
CLIENT_URL=http://localhost:5173
```

Generate a random JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

Start the backend:

```bash
npm run dev
```

The API should be available at:

`http://localhost:5001`

Check the health endpoint:

`http://localhost:5001/api/health`

### 3. Configure the Frontend

Open another terminal in the project root:

```bash
cd frontend
npm install
```

Create a `.env` file using `frontend/.env.example` as a reference.

Add your public Stream API key:

```env
VITE_STREAM_API_KEY=your_stream_public_api_key
```

If your deployment or local configuration requires a custom API base URL, configure `VITE_API_URL` according to `frontend/src/lib/api.js` and the project's API setup.

**Important:** Never place `STREAM_API_SECRET`, your MongoDB password, or your JWT signing secret in frontend environment variables.

Start the frontend:

```bash
npm run dev
```

Vite will display the local development URL, usually:

`http://localhost:5173`

---

## 🔑 Environment Variables

### Backend

| Variable            | Purpose                                       |
| ------------------- | --------------------------------------------- |
| `MONGO_URI`         | MongoDB connection string                     |
| `JWT_SECRET_KEY`    | Secret used for signing authentication tokens |
| `STREAM_API_KEY`    | Public Stream application key                 |
| `STREAM_API_SECRET` | Private Stream application secret             |
| `CLIENT_URL`        | Allowed frontend origin                       |
| `NODE_ENV`          | Application environment                       |
| `PORT`              | Backend server port                           |
| `COOKIE_SAME_SITE`  | Optional cookie configuration                 |
| `TRUST_PROXY`       | Optional reverse-proxy configuration          |

### Frontend

| Variable              | Purpose                                                      |
| --------------------- | ------------------------------------------------------------ |
| `VITE_STREAM_API_KEY` | Public Stream application key                                |
| `VITE_API_URL`        | Optional API base URL, depending on deployment configuration |

Keep real credentials in local environment files or your hosting provider's environment settings. Never commit them to GitHub.

---

## 🧪 Running Tests

### Backend

The backend tests use a separate test database. Make sure the test database name ends with `_test` because tests may clear its contents.

Example:

```bash
cd backend
```

In PowerShell, set the test database URI and run the tests:

```powershell
$env:TEST_MONGO_URI="mongodb://127.0.0.1:27017/nexora_test"
npm test
```

Use the environment variable name expected by the backend test configuration.

### Frontend

```bash
cd frontend
npm test
npm run lint
npm run build
```

The test and build scripts available in each `package.json` determine which commands are supported.

---

## 🌐 Deployment

The application can be deployed using the following services:

| Component      | Suggested Platform |
| -------------- | ------------------ |
| Frontend       | Vercel             |
| Backend        | Render             |
| Database       | MongoDB Atlas      |
| Chat and video | Stream             |

### Backend Deployment

Create a Web Service on Render and configure:

| Setting           | Value         |
| ----------------- | ------------- |
| Root Directory    | `backend`     |
| Build Command     | `npm install` |
| Start Command     | `npm start`   |
| Health Check Path | `/api/health` |

Add the required backend environment variables through Render's dashboard.

Set `CLIENT_URL` to the deployed frontend origin and configure cookie and proxy settings according to the final deployment architecture.

### Frontend Deployment

Create a Vercel project connected to the GitHub repository.

| Setting          | Value           |
| ---------------- | --------------- |
| Root Directory   | `frontend`      |
| Build Command    | `npm run build` |
| Output Directory | `dist`          |

Configure `VITE_STREAM_API_KEY` and the API routing required by the selected deployment architecture.

If using a Vercel rewrite to forward `/api` requests to Render, update `frontend/vercel.json` with the actual backend hostname and verify the routing before going live.

### Stream Configuration

Use the correct Stream application credentials for your deployment.

Review the permissions configured for messaging channels and video calls. Verify that only authorized users can access private conversations and calls.

---

## ✅ Manual Testing Checklist

Before considering the application ready for public use, test it with two separate accounts, preferably in different browsers.

* [ ] Register two accounts.
* [ ] Log in and complete onboarding.
* [ ] Discover another user.
* [ ] Send and accept a friend request.
* [ ] Open a chat and exchange messages in both directions.
* [ ] Refresh the page and verify message history.
* [ ] Start a video call and join from the second account.
* [ ] Verify audio and video in both directions.
* [ ] Leave the call and verify that the camera and microphone stop.
* [ ] Check authentication behavior after refreshing the page.
* [ ] Verify that private chats and calls cannot be accessed by unauthorized users.

These checks require valid Stream credentials and appropriate browser permissions.

## 🚀 Future Enhancements

* Friend Request Management: Add the ability to reject incoming friend requests and improve request management.
* Notification Management: Implement read/unread status for friend-request notifications.
* Database Optimization: Introduce database constraints and indexes to prevent duplicate friend requests and improve data consistency.
* Enhanced Security: Strengthen access control and permissions for private chats and video calls.
* Improved Reliability: Expand automated and integration testing for real-time messaging and video calling.

## 🔐 Security Notes

* Never commit real `.env` files.
* Keep database credentials, JWT secrets, and Stream's private API secret on the backend.
* Use strong passwords and rotate any credentials that have been exposed.
* Review authentication, database access, CORS, cookies, and Stream permissions before public deployment.
* Back up the database before running migration scripts.

---

## 👨‍💻 Author
 <p align="center">
  <img
    src="https://github.com/user-attachments/assets/b7fa75e1-c640-4ddc-b27f-61e039ae819d"
    alt="Nexora Launch Celebration"
    width="300"
  />
</p>

**Md Akib Khan**

GitHub: [CodeByAkib](https://github.com/CodeByAkib)

## 💬 Nexora

**Connect, chat, and call—all in one place.**
