# Movie Manager 🎬

A modern, full-stack web application for managing your movie collection with user authentication, CRUD operations, and a beautiful responsive UI.

## Features ✨

- **User Authentication**: Secure login and registration system
- **Movie Management**: Add, view, edit, and delete movies
- **Rich Movie Data**: Title, description, genre, release year, rating, and poster images
- **Search & Filter**: Find movies by title or description
- **Upload Timestamps**: Track when movies were added to the collection
- **Responsive Design**: Modern UI that works on desktop and mobile
- **Real-time Updates**: Dynamic interface with immediate feedback

## Tech Stack 🛠️

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation
- **Heroicons** for icons

## Getting Started 🚀

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-manager
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/moviemanager
   
   # JWT Secret (change this to a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   
   # Server
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system:
   - **Local MongoDB**: Start the MongoDB service
   - **MongoDB Atlas**: Use your Atlas connection string in the `.env` file

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:3000` to access the application.

## API Endpoints 📡

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movie Routes
- `GET /api/movies` - Get all movies (protected)
- `GET /api/movies/:id` - Get single movie (protected)
- `POST /api/movies` - Create new movie (protected)
- `PUT /api/movies/:id` - Update movie (protected)
- `DELETE /api/movies/:id` - Delete movie (protected)
- `GET /api/movies/user/my-movies` - Get current user's movies (protected)

## Usage Guide 📖

### Registration & Login
1. Visit the application homepage
2. Click "Sign up here" to create a new account
3. Fill in your username, email, and password
4. Once registered, you'll be automatically logged in

### Managing Movies
1. **Add a Movie**: Click the "Add Movie" button and fill in the details
2. **View Movies**: Browse your collection on the main dashboard
3. **Search Movies**: Use the search bar to find specific movies
4. **Edit Movies**: Click the edit icon on any movie card
5. **Delete Movies**: Click the delete icon and confirm the action

### Movie Information
Each movie can include:
- **Title** (required)
- **Description** (required)
- **Genre** (optional)
- **Release Year** (optional)
- **Rating** (0-10 scale, optional)
- **Poster URL** (optional - displays movie poster)

## Project Structure 📁

```
movie-manager/
├── server/                 # Backend application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── index.js          # Server entry point
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API service functions
│   │   └── types/         # TypeScript type definitions
│   └── public/           # Static assets
├── .env                  # Environment variables
├── package.json          # Backend dependencies
└── README.md            # This file
```

## Development Notes 🔧

### Backend Features
- RESTful API design
- JWT-based authentication
- Input validation and sanitization
- Error handling middleware
- MongoDB indexing for performance
- Password hashing with bcrypt

### Frontend Features
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Context API for state management
- Protected routes
- Form validation
- Loading states and error handling
- Debounced search functionality

## Deployment 🌐

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB connection string is configured
3. Build and deploy using your preferred service (Heroku, Vercel, etc.)

### Frontend Deployment
1. Build the React application: `cd client && npm run build`
2. Serve the static files from the `build` directory
3. Configure the API base URL for production

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support 💬

If you encounter any issues or have questions, please feel free to open an issue on the repository.

---

Made with ❤️ by Movie Manager Team