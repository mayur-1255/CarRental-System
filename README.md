# 🚗 Car Rental System

A full-stack web application for car rental management with separate interfaces for customers and car owners. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### For Customers
- **Browse Cars**: View available cars with detailed information including images, specifications, and pricing
- **Search & Filter**: Find cars by brand, model, category, location, and other criteria
- **Car Details**: Detailed car information with images, features, and rental terms
- **Booking System**: Book cars with pickup and return dates
- **User Profile**: Manage personal information, license details, and contact information
- **Booking Management**: View and manage personal bookings
- **Responsive Design**: Mobile-friendly interface

### For Car Owners
- **Dashboard**: Overview of cars, bookings, and earnings
- **Car Management**: Add, edit, and delete car listings
- **Booking Management**: View and manage customer bookings
- **Owner Profile**: Manage owner information and verification details

### General Features
- **User Authentication**: Secure login and registration system
- **Role-based Access**: Separate interfaces for customers and owners
- **Image Upload**: Car image management with ImageKit integration
- **Real-time Notifications**: Toast notifications for user feedback
- **Responsive UI**: Modern, mobile-first design with Tailwind CSS

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **Motion** - Animation library
- **Vite** - Build tool and development server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **ImageKit** - Image storage and optimization
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
CarRental-System/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   └── owner/      # Owner-specific components
│   │   ├── pages/          # Page components
│   │   │   └── owner/      # Owner dashboard pages
│   │   ├── context/        # React context for state management
│   │   └── assets/         # Static assets (images, icons)
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js backend
│   ├── configs/            # Database and service configurations
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── package.json
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CarRental-System
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

5. **Start the development servers**

   **Terminal 1 - Start the backend server:**
   ```bash
   cd server
   npm run server
   ```

   **Terminal 2 - Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📱 Usage

### For Customers
1. **Register/Login** - Create an account or sign in
2. **Browse Cars** - Explore available cars on the home page or cars page
3. **View Details** - Click on any car to see detailed information
4. **Book a Car** - Select pickup and return dates, provide passenger details
5. **Manage Bookings** - View your bookings in the "My Bookings" section
6. **Update Profile** - Manage your personal information and documents

### For Car Owners
1. **Register as Owner** - Sign up with owner role
2. **Access Dashboard** - Navigate to `/owner` for the owner panel
3. **Add Cars** - List your cars with images and specifications
4. **Manage Cars** - Edit or remove car listings
5. **View Bookings** - Monitor customer bookings for your cars
6. **Update Profile** - Manage owner information and verification

## 🔧 API Endpoints

### User Routes (`/api/user`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile

### Owner Routes (`/api/owner`)
- `POST /register` - Owner registration
- `POST /login` - Owner login
- `GET /profile` - Get owner profile
- `PUT /profile` - Update owner profile
- `POST /add-car` - Add new car
- `GET /cars` - Get owner's cars
- `PUT /car/:id` - Update car details
- `DELETE /car/:id` - Delete car

### Booking Routes (`/api/bookings`)
- `POST /create` - Create new booking
- `GET /user/:userId` - Get user's bookings
- `GET /owner/:ownerId` - Get owner's bookings
- `PUT /:id` - Update booking status

## 🎨 UI Components

- **Hero Section** - Landing page banner
- **Car Cards** - Car listing components
- **Navigation** - Responsive navigation bars
- **Forms** - Login, registration, and booking forms
- **Modals** - Login modal and confirmation dialogs
- **Dashboard** - Owner management interface
- **Footer** - Site footer with links

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- CORS protection
- Secure file upload handling

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables
2. Deploy the server directory
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS approach
- MongoDB for the flexible database solution
- All contributors who helped improve this project

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact the development team
- Check the documentation

---

**Happy Coding! 🚗✨**
