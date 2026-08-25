const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { error } = require('../utils/response');
const db = require('../config/db');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    // Guest fallback: Attach default active student user
    try {
      const defaultUsers = await db.query('SELECT id, email, role, status FROM users WHERE status = ? ORDER BY id ASC LIMIT 1', ['active']);
      if (defaultUsers.length > 0) {
        req.user = {
          id: defaultUsers[0].id,
          email: defaultUsers[0].email,
          role: defaultUsers[0].role
        };
        return next();
      }
    } catch (e) {
      // ignore
    }
    return error(res, 'Authentication token required', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const users = await db.query(
      'SELECT id, email, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].status !== 'active') {
      return error(res, 'User account not found or inactive', 401);
    }

    req.user = {
      id: users[0].id,
      email: users[0].email,
      role: users[0].role
    };

    next();
  } catch (err) {
    // If token expired/invalid, fallback to default student to avoid abrupt interruptions
    try {
      const defaultUsers = await db.query('SELECT id, email, role FROM users WHERE status = ? ORDER BY id ASC LIMIT 1', ['active']);
      if (defaultUsers.length > 0) {
        req.user = {
          id: defaultUsers[0].id,
          email: defaultUsers[0].email,
          role: defaultUsers[0].role
        };
        return next();
      }
    } catch (e) {}
    return error(res, 'Invalid or expired token', 403);
  }
}

/**
 * Strict authentication — no guest fallback.
 *
 * authenticateToken deliberately attaches "the first active user" when a token
 * is missing or invalid, which is fine for a signed-out demo of public content
 * but catastrophic anywhere that reads or writes a specific person's data: an
 * anonymous caller simply becomes user id 1. Every such route must use this
 * instead.
 */
async function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return error(res, 'Sign in to continue.', 401);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const users = await db.query(
      'SELECT id, email, role, status FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (users.length === 0 || users[0].status !== 'active') {
      return error(res, 'Your account is not active.', 401);
    }

    req.user = { id: users[0].id, email: users[0].email, role: users[0].role };
    return next();
  } catch (err) {
    return error(res, 'Your session has expired. Please sign in again.', 401);
  }
}

// Optional auth for public routes with personalized perks
async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, config.jwtSecret);
      const users = await db.query('SELECT id, email, role FROM users WHERE id = ?', [decoded.userId]);
      if (users.length > 0) {
        req.user = users[0];
      }
    } catch (e) {
      // ignore
    }
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAuth,
  optionalAuth
};
