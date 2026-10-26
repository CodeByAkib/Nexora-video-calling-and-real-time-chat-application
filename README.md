# Nexora 💬

Nexora is a real-time communication app where people can connect with others who share similar interests. Users can discover new people, send friend requests, chat in real time, and make video calls—all in one place.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS, daisyUI, React Query
**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
**Chat & Video:** Stream Chat and Stream Video

## Project Structure

```text
Nexora/
├── backend/       # Express API, database models, tests and scripts
└── frontend/      # React application, components and pages
```

## Getting Started

Follow these steps to run Nexora locally.

### Prerequisites

Before getting started, make sure you have:

* Node.js 20 or later
* MongoDB running locally or a MongoDB Atlas account
* A Stream account with an application created

### 1. Set Up the Backend

Open a terminal and run:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a reference, then add your environment variables.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5001`.

You can check whether the server is running by opening `http://localhost:5001/api/health`.

### 2. Set Up the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file using the frontend's `.env.example` file. Add your Stream API key.

Start the frontend:

```bash
npm run dev
```

Vite will display the local URL, usually `http://localhost:5173`.

## Environment Variables

Keep your actual `.env` files private. Never commit passwords, API secrets, or database credentials to GitHub.

### Backend — `backend/.env`

| Variable            | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `MONGO_URI`         | MongoDB connection string                          |
| `JWT_SECRET_KEY`    | Secret used to sign authentication tokens          |
| `STREAM_API_KEY`    | Public Stream application key                      |
| `STREAM_API_SECRET` | Private Stream application secret                  |
| `CLIENT_URL`        | Frontend URL, especially in production             |
| `NODE_ENV`          | Set to `production` on the hosting platform        |
| `PORT`              | Server port; the hosting platform may provide this |
| `COOKIE_SAME_SITE`  | Optional cookie setting                            |
| `TRUST_PROXY`       | Optional proxy configuration                       |

Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### Frontend — `frontend/.env`

| Variable              | Purpose                                                                    |
| --------------------- | -------------------------------------------------------------------------- |
| `VITE_STREAM_API_KEY` | Stream public API key                                                      |
| `VITE_API_URL`        | Optional API base URL; leave unset when using the recommended `/api` setup |

The frontend's Stream API key must match `STREAM_API_KEY` in the backend. **Never expose `STREAM_API_SECRET` in frontend code.**

Older versions of the project used the misspelled variables `STEAM_API_KEY` and `STEAM_API_SECRET`. Update them to `STREAM_API_KEY` and `STREAM_API_SECRET` when using the current configuration.

## Running Tests

### Backend

The backend test suite uses a separate test database. Make sure its database name ends with `_test`, because the tests may clear its contents.

For example:

```bash
cd backend
TEST_MONGO_URI=mongodb://127.0.0.1:27017/nexora_test npm test
```

### Frontend

```bash
cd frontend
npm test
npm run lint
npm run build
```

Use the commands supported by the scripts in each `package.json`.

The automated tests do not make real Stream Chat API calls. Chat and video calling should also be tested manually with valid Stream credentials.

## Deployment

Nexora can be deployed using the following setup:

* **Frontend:** Vercel
* **Backend:** Render
* **Database:** MongoDB Atlas
* **Chat and video:** Stream

### 1. Configure MongoDB Atlas

Create a database and database user, then copy the connection string into the backend's `MONGO_URI` environment variable.

Configure Network Access to allow connections from your backend host. Use a strong database password and restrict network access where practical.

### 2. Deploy the Backend on Render

Create a new Web Service and configure:

| Setting           | Value         |
| ----------------- | ------------- |
| Root directory    | `backend`     |
| Build command     | `npm install` |
| Start command     | `npm start`   |
| Health check path | `/api/health` |

Add the required backend environment variables in Render's dashboard.

Set `CLIENT_URL` to your deployed frontend's origin. Configure `TRUST_PROXY` according to your hosting setup.

Free hosting instances may sleep when idle, so the first request after a period of inactivity can take longer.

### 3. Deploy the Frontend on Vercel

Create a Vercel project using your GitHub repository.

| Setting          | Value           |
| ---------------- | --------------- |
| Root directory   | `frontend`      |
| Build command    | `npm run build` |
| Output directory | `dist`          |

Add `VITE_STREAM_API_KEY` to the frontend's environment variables.

If you're using Vercel for the frontend and Render for the backend, configure `frontend/vercel.json` to forward API requests to your Render service and support React Router routes.

Example:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-SERVICE.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Replace `YOUR-SERVICE` with your actual Render service hostname.

Using this rewrite lets the frontend send API requests through the Vercel domain, which also helps avoid cross-site cookie problems. Keep the backend's origin checks and cookie configuration consistent with your deployment.

### 4. Configure Stream

Use the correct Stream application credentials for your deployment.

Review the permissions for the `messaging` channel type and the `default` video call type before making the application publicly available. The Stream dashboard's permissions determine who can access channels and calls.

### Before Going Live

* Rotate any secrets that have previously been exposed.
* Verify authentication and cookie behavior in production.
* Test messaging and video calls with two separate accounts.
* Check that private conversations are protected by the appropriate Stream permissions.
* Replace the placeholder screenshots and images with actual Nexora screenshots.

## Updating Existing Avatars

Some older accounts may still use avatar URLs from a provider that is no longer available, or URLs containing email addresses.

The project includes an avatar migration script that updates the `profilePic` field. It runs in preview mode by default.

From the backend directory:

```bash
npm run migrate:avatars
```

After reviewing the changes and taking a database backup, apply them with:

```bash
npm run migrate:avatars -- --apply
```

To also update profile pictures stored in Stream:

```bash
npm run migrate:avatars -- --apply --sync-stream
```

The migration should only be applied after reviewing the script and confirming the database connection.

## Manual Testing

Before considering the application ready for use, test it with two separate accounts, preferably in different browsers.

1. Create two accounts and complete onboarding.
2. Send a friend request and accept it.
3. Open a chat and exchange messages in both directions.
4. Refresh the page and check that message history is still available.
5. Start a video call and join from the second account.
6. Check audio and video in both directions.
7. Leave the call and verify that the camera and microphone are no longer active.

These checks require valid Stream credentials and access to the relevant browser permissions.

## Current Limitations

* Friend requests can be accepted, but rejecting a request is not currently supported.
* Stream permissions control access to private channels and video calls. Review these permissions carefully before making the application public.
* Friend-request pairs do not currently have a unique database index to prevent every possible duplicate-request race condition.
* Accepted friend-request notifications are not currently marked as read.

## Security Notes

* Never commit `.env` files or private credentials.
* Use a strong JWT secret and database password.
* Keep Stream's private API secret on the backend only.
* Review authentication, database access, and Stream permissions before deploying publicly.

---

**Nexora — Connect, chat, and call.**
