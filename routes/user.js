const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { getUserDetails } = require('../controllers/userController');

// Get user details (protected route)
router.get('/details', authenticate, getUserDetails);

module.exports = router;

