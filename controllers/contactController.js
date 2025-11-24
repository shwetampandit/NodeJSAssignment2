const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

// Create new contact
exports.createContact = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, phone, address, country } = req.body;

    // Create new contact
    const contact = new Contact({
      user: req.user._id,
      name,
      email,
      phone,
      address,
      country,
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: {
        contact: {
          id: contact._id,
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          country: contact.country,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating contact',
      error: error.message,
    });
  }
};

// List all contacts
exports.listContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Contact.countDocuments({ user: req.user._id });

    // Get contacts with pagination
    const contacts = await Contact.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      success: true,
      message: 'Contacts retrieved successfully',
      data: {
        contacts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('List contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving contacts',
      error: error.message,
    });
  }
};

// Search contacts
exports.searchContacts = async (req, res) => {
  try {
    const { name, email, phone } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = { user: req.user._id };
    
    if (name) {
      searchQuery.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }
    
    if (email) {
      searchQuery.email = { $regex: email, $options: 'i' };
    }
    
    if (phone) {
      searchQuery.phone = { $regex: phone, $options: 'i' };
    }

    // If no search parameters provided, return all contacts
    if (!name && !email && !phone) {
      return exports.listContacts(req, res);
    }

    // Get total count for pagination
    const total = await Contact.countDocuments(searchQuery);

    // Get contacts with pagination
    const contacts = await Contact.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-__v');

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        contacts,
        searchParams: { name, email, phone },
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalContacts: total,
          limit,
        },
      },
    });
  } catch (error) {
    console.error('Search contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching contacts',
      error: error.message,
    });
  }
};

