# TaskMaster Pro - Enhanced To-Do MVC Application

My interpretation of [todoMVC](https://todomvc.com/), originally written from scratch in December 2016 ([GitHub Repo](https://github.com/Cu7ious/Classic-ToDo-App ) | [Demo on Codepen](https://codepen.io/Cu7ious/full/bBJqRK))

This application is based on the classic To-Do MVC structure, with many enhancements to provide a more comprehensive and user-friendly experience. It allows users to manage their projects and tasks effectively, with additional features such as user authentication and project/task search.

## Features

- **User Authentication**: Secure login with GitHub OAuth 2.0 integration.
- **User Profile**: Each user has a profile with a profile picture.
- **Project Management**: Create, read, update, and delete projects.
- **Task Management**: Create, read, update, and delete tasks within projects.
- **Task Filtering**: Filter tasks based on various criteria.
- **Search Functionality**: Search for projects and tasks associated with the logged-in user.
- **Responsive Design**: Mobile-friendly interface.

## Technology Stack

- **Frontend**: React.js on Vite.js (with TypeScript)
- **Backend**: Koa.js
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: Passport.js with GitHub OAuth 2.0
- **State Management**: Context API + useReducer
- **Stylng**: Emotion CSS-in-JS

## Planned Future Enhancements

1. **Routing Using TanStack Router**: Implementing TanStack Router for more efficient and feature-rich routing capabilities.
2. **Permanent URLs for Different Views**: Enabling permanent URLs for different views to facilitate easier sharing and navigation.
3. **Tag Explorer**: Adding a tag explorer feature to help users browse and filter projects and tasks by tags.
4. **Search by Tags**: Extending the search functionality to include searching by tags, enhancing the ability to find relevant tasks and projects.
5. **Improve Pagination**

### Quick Start

```bash
cd TaskMaster-Pro && docker-compose up --build -d # runs server
cd web && npm run dev # runs front-end
open http://localhost:5173/ # opens app in the browser
```

## Installation

### Prerequisites

- Node.js
- MongoDB
- GitHub OAuth App (for authentication)

### Backend Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/Cu7ious/TaskMaster-Pro.git
   cd TaskMaster-Pro
   ```

2. Install backend dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory of the repository, and add the following environment variables:

   ```env
   SESSION_SECRET=your-session-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   MONGODB_URI=mongodb://localhost/your-database
   ```

4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Install frontend dependencies:

   ```sh
   cd web
   npm install
   ```

2. Create a `.env.development` file in the `web` directory and add the following environment variables:

   ```env
   VITE_API_URL='http://localhost:3000/api/v1'
   ```

3. Start the frontend development server:
   ```sh
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Sign in using your GitHub account.
3. Create new projects and tasks, and use the search functionality to find specific tasks or projects.

## API Endpoints

### Authentication

- **GET /api/v1/user/login**: Redirects to GitHub for authentication.
- **GET /api/v1/user/profile**: User profile.
- **GET /api/v1/user/auth/github/callback**: GitHub callback URL.
- **GET /api/v1/logout**: Logs out the current user.

### Projects

- **GET /api/v1/projects**: Get all projects for the authenticated user.
- **POST /api/v1/projects**: Create a new project.
- **GET /api/v1/projects/:id**: Get a specific project.
- **PUT /api/v1/projects/:id**: Update a project.
- **DELETE /api/v1/projects/:id**: Delete a project.

### Tasks

- **GET /api/v1/projects/:projectId/tasks**: Get all tasks for a specific project.
- **POST /api/v1/projects/:projectId/tasks**: Create a new task.
- **GET /api/v1/tasks/:id**: Get a specific task.
- **PUT /api/v1/tasks/:id**: Update a task.
- **DELETE /api/v1/tasks/:id**: Delete a task.

### Search

- **GET /api/v1/search?query=**: Search for projects and tasks associated with the authenticated user.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
