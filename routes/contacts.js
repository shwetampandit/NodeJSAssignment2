const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const {
  createContact,
  listContacts,
  searchContacts,
} = require('../controllers/contactController');

// Validation rules for creating contact
const createContactValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required'),
  body('address')
    .optional()
    .trim(),
  body('country')
    .optional()
    .trim(),
];

// All routes require authentication
router.use(authenticate);

// Create new contact
router.post('/', createContactValidation, createContact);

// List all contacts
router.get('/', listContacts);

// Search contacts
router.get('/search', searchContacts);

module.exports = router;

