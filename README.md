# TaskFlow

TaskFlow is a task management app built with MongoDB, Express, React, and Node.js. It includes account authentication and tools for organizing and tracking personal tasks.

## Features

- Register, sign in, and sign out with cookie-based JWT authentication
- Create, view, update, and delete tasks
- Track task status, priority, and due dates
- Search, filter, sort, and paginate tasks
- Validate API input and apply request rate limits

## Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose, Joi
- **Database:** MongoDB

## Project structure

```text
backend/    Express API, routes, controllers, models, and middleware
frontend/   React client
.env.example
package.json
```

## Prerequisites

- Node.js and npm
- MongoDB running locally or a MongoDB connection string

## Getting started

1. Install dependencies from the project root:

   ```bash
   npm run install-all
   ```

2. Create a root `.env` file from the example:

   ```bash
   cp .env.example .env
   ```

3. Set `MONGO_URI` to your MongoDB connection string and replace the example `JWT_SECRET` with a private random value. The other settings can be adjusted for your environment.

4. Start the frontend and API together:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:5173` and the API at `http://localhost:5000`. The API connects to MongoDB before it starts listening. The frontend API URL is configured in `frontend/src/api/axios.js`.

## Environment variables

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/taskflow_db` |
| `JWT_SECRET` | Secret used to sign authentication tokens | Set your own value |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `CLIENT_URL` | Frontend origin allowed by CORS | `http://localhost:5173` |
| `NODE_ENV` | Runtime environment | `development` |

## API overview

All routes are under `/api`. The frontend sends requests with credentials enabled so the browser can include the authentication cookie.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `POST` | `/api/auth/register` | Create an account |
| `POST` | `/api/auth/login` | Sign in |
| `GET` | `/api/auth/me` | Get the current account (authenticated) |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/tasks` | List tasks (authenticated) |
| `POST` | `/api/tasks` | Create a task (authenticated) |
| `GET` | `/api/tasks/:id` | Get a task (authenticated) |
| `PUT` | `/api/tasks/:id` | Update a task (authenticated) |
| `DELETE` | `/api/tasks/:id` | Delete a task (authenticated) |

The task list accepts `status`, `priority`, `search`, `sortBy`, `order`, `page`, and `limit` query parameters.

## Useful scripts

Run these from the project root unless a directory is specified.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API and frontend in development mode |
| `npm run install-all` | Install root, backend, and frontend dependencies |
| `npm run dev` in `backend/` | Start the API with Node watch mode |
| `npm run start` in `backend/` | Start the API |
| `npm run dev` in `frontend/` | Start the Vite development server |
| `npm run build` in `frontend/` | Build the frontend for production |
| `npm run lint` in `frontend/` | Lint the frontend |
