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

// @route   Post api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Destructure req.body to get information
    const { email, password } = req.body;

    try {
      // Check if user exists in db by calling model
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Using bcrypt to validate the plaintext password with encrypted
      const isMatch = await bcrypt.compare(password, user.password);

      // Check to see if no match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Create payload
      const payload = {
        user: {
          id: user.id,
        },
      };

      // Sign token, pass payload, secret, exp, callback
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 36000 },
        (e, token) => {
          if (e) throw e;
          res.json({ token });
        }
      );
    } catch (e) {
      console.error(e.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
