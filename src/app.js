require('dotenv').config()
const express = require('express')
const indexRoutes = require('./routes/index.routes')
const authRoutes = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')

const app = express()

// ===== CSP Middleware =====
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; \
     script-src 'self' 'unsafe-inline' https://cdn.socket.io https://fonts.googleapis.com https://fonts.gstatic.com; \
     style-src 'self' 'unsafe-inline' https:; \
     font-src 'self' https://fonts.gstatic.com; \
     img-src 'self' data:; \
     connect-src 'self' https://cdn.socket.io ws: wss:;"
  );
  next();
});

// ===== View Engine =====
app.set("view engine", "ejs")

// ===== Static Files =====
app.use(express.static('public'))

// ===== Body Parsing =====
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ===== Routes =====
app.use("/", indexRoutes)
app.use("/auth", authRoutes)

module.exports = app
