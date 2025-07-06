# Portfolio Backend

A robust Node.js backend API built with TypeScript, Express, and MongoDB. This backend serves as the server-side infrastructure for my personal portfolio website, providing secure endpoints for contact forms, project management, and other portfolio-related functionality.

## 🚀 Features

- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database for data persistence
- **Authentication**: Secure user authentication system
- **API Documentation**: RESTful API endpoints
- **Security**: Helmet, CORS, and other security middleware
- **Logging**: Comprehensive logging system
- **Testing**: Jest testing framework
- **Docker**: Containerized deployment
- **Rate Limiting**: Protection against spam and abuse

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **Validation**: AJV
- **Security**: Helmet, CORS
- **Logging**: Morgan
- **Testing**: Jest
- **Build Tools**: TypeScript Compiler, Terser
- **Process Management**: PM2 (production)

## 📦 Installation

### Step 1: Clone the repository

```bash
git clone https://github.com/IsmaellHV/portfolio-backend.git
cd portfolio-backend
```

### Step 2: Install dependencies

```bash
npm install
# or
pnpm install
```

### Step 3: Set up environment variables

```bash
cp .env.example .env
```

### Step 4: Configure your environment variables in `.env`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-secret-key
```

### Step 5: Start the development server

```bash
npm run start
# or
pnpm start
```

## 🚀 Usage

### Development

```bash
npm run start    # Start development server with nodemon
npm run build    # Build for production
npm run test     # Run tests
npm run lint     # Run ESLint
```

### Production

```bash
npm run build    # Build the application
npm run minify   # Minify built files
node build/index.js  # Start production server
```

## 📡 API Endpoints

### Base URL

```text
http://localhost:3000/api/v1
```

### Available Endpoints

- `GET /health` - Health check endpoint
- `POST /contact` - Contact form submission
- `GET /projects` - Get all projects
- `GET /projects/:id` - Get project by ID
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration

## 🏗️ Project Structure

```text
src/
├── assets/          # Static assets
├── context/         # Business logic and domain entities
│   ├── shared/      # Shared domain logic
│   └── Utilitie/    # Utility functions
├── env/             # Environment configuration
├── rest/            # REST API layer
├── language/        # Internationalization
└── types/           # TypeScript type definitions
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Schema validation with AJV
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data protection

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 🐳 Docker

Build and run with Docker:

```bash
docker build -t portfolio-backend .
docker run -p 3000:3000 portfolio-backend
```

## 📝 Environment Variables

| Variable      | Description               | Default                               |
| ------------- | ------------------------- | ------------------------------------- |
| `PORT`        | Server port               | `3000`                                |
| `NODE_ENV`    | Environment               | `development`                         |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `JWT_SECRET`  | JWT secret key            | Required                              |
| `CORS_ORIGIN` | Allowed CORS origins      | `*`                                   |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

### Ismael Hurtado

- 📧 Email: [ismaelhv@outlook.com](mailto:ismaelhv@outlook.com)
- 💼 LinkedIn: [linkedin.com/in/ihurtadov](https://www.linkedin.com/in/ihurtadov/)
- 🐙 GitHub: [github.com/IsmaellHV](https://github.com/IsmaellHV)
- 🌐 Portfolio: [ismaelhv.com](https://ismaelhv.com)

## 🙏 Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the robust database
- TypeScript team for type safety
- All contributors and supporters

---

⭐ If you find this project useful, please consider giving it a star!
