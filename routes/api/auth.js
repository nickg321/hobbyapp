const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

// @route   Get api/auth
// @desc    Test Route
// @access  Public

// Add middleware in as second parameter
router.get('/', auth, async (req, res) => {
  try {
    const user = await (await User.findById(req.user.id)).isSelected(
      '-password'
    );
    res.json(user);
  } catch (e) {
    console.error(e.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
