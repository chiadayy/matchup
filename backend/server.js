import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";
import matchRouter from "./routes/matches.js";
import paymentRouter from "./routes/payments.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.use("/users", userRouter);
app.use("/matches", matchRouter);
app.use("/payments", paymentRouter);

app.get("/", (req, res) => {
  res.send("MatchUp backend is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// // Request logging
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//   next();
// });

// // Routes
// app.use('/auth', require('./routes/auth'));

// // Health check
// app.get('/health', (req, res) => {
//   res.json({
//     status: 'ok',
//     timestamp: new Date().toISOString(),
//     uptime: process.uptime()
//   });

// app.get("/", (req, res) => {
//   res.send("Its working!");
// });

// app.listen(3000, () => {
//   console.log(`Server + Supabase is running at http://localhost:3000`);
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`\n🚀 MatchUp API Server`);
//   console.log(`   Port: ${PORT}`);
//   console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`   CORS Origin: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}`);
//   console.log(`\n Server is running at http://localhost:${PORT}`);
//   console.log(` Health check: http://localhost:${PORT}/health\n`);
// });

export default app;
