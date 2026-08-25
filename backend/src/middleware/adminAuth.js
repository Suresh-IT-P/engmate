const { error } = require('../utils/response');

function requireRole(allowedRoles = ['admin']) {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Authentication required', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return error(res, 'Access denied. Administrator or Instructor privileges required.', 403);
    }

    next();
  };
}

module.exports = {
  requireAdmin: requireRole(['admin', 'super_admin']),
  requireTeacherOrAdmin: requireRole(['admin', 'super_admin', 'teacher'])
};
