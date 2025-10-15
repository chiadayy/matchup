/**
 * Authentication routes
 * Handles register, login, refresh, logout, and user info
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');
const { verifyAccessToken } = require('../middleware/authz');

const router = express.Router();

// Constants
const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TTL_DAYS || '30', 10);

/**
 * POST /auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Password must be at least 8 characters'
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Validate role
    const validRole = ['player', 'organiser'].includes(role) ? role : 'player';

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [normalizedEmail, passwordHash, name || null, validRole]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        email: normalizedEmail,
        name: name || null,
        role: validRole
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to register user'
    });
  }
});

/**
 * POST /auth/login
 * Authenticate user and return access token + refresh cookie
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Email and password are required'
      });
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const [users] = await db.query(
      'SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = ?',
      [normalizedEmail]
    );

    if (users.length === 0) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    // Generate access token (JWT, 15 minutes)
    const accessToken = jwt.sign(
      {
        sub: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Generate refresh token (random bytes)
    const refreshTokenRaw = crypto.randomBytes(48).toString('hex');
    const refreshTokenHash = await bcrypt.hash(refreshTokenRaw, SALT_ROUNDS);

    // Calculate expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

    // Store refresh token in database
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [user.id, refreshTokenHash, expiresAt]
    );

    // Set refresh token as httpOnly cookie
    res.cookie('refreshToken', refreshTokenRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000, // milliseconds
      path: '/auth/refresh'
    });

    // Return access token and user info
    res.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to login'
    });
  }
});

/**
 * POST /auth/refresh
 * Rotate refresh token and return new access token
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Refresh token missing'
      });
    }

    // Find all non-expired refresh tokens
    const [tokens] = await db.query(
      `SELECT rt.id, rt.user_id, rt.token_hash, u.role
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.expires_at > NOW()`
    );

    // Check each token hash
    let matchedToken = null;
    for (const token of tokens) {
      const isValid = await bcrypt.compare(refreshToken, token.token_hash);
      if (isValid) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    // Delete old refresh token (rotation)
    await db.query('DELETE FROM refresh_tokens WHERE id = ?', [matchedToken.id]);

    // Generate new access token
    const accessToken = jwt.sign(
      {
        sub: matchedToken.user_id,
        role: matchedToken.role
      },
      process.env.JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    // Generate new refresh token
    const newRefreshTokenRaw = crypto.randomBytes(48).toString('hex');
    const newRefreshTokenHash = await bcrypt.hash(newRefreshTokenRaw, SALT_ROUNDS);

    // Calculate new expiry
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TTL_DAYS);

    // Store new refresh token
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
      [matchedToken.user_id, newRefreshTokenHash, expiresAt]
    );

    // Set new refresh cookie
    res.cookie('refreshToken', newRefreshTokenRaw, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000,
      path: '/auth/refresh'
    });

    res.json({ accessToken });
  } catch (err) {
    console.error('Refresh error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to refresh token'
    });
  }
});

/**
 * POST /auth/logout
 * Delete refresh token and clear cookie
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Find and delete matching refresh token
      const [tokens] = await db.query(
        'SELECT id, token_hash FROM refresh_tokens WHERE expires_at > NOW()'
      );

      for (const token of tokens) {
        const isValid = await bcrypt.compare(refreshToken, token.token_hash);
        if (isValid) {
          await db.query('DELETE FROM refresh_tokens WHERE id = ?', [token.id]);
          break;
        }
      }
    }

    // Clear refresh cookie
    res.clearCookie('refreshToken', { path: '/auth/refresh' });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to logout'
    });
  }
});

/**
 * GET /auth/me
 * Get current user info (protected route)
 */
router.get('/me', verifyAccessToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, name, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to get user info'
    });
  }
});

module.exports = router;
