const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const config = require("config");
const jwtSecret = config.get("jwtSecret");

const User = require("../../models/User");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

router.post("/", [
  check("email", "Please include a valid email.").isEmail(),
  check("password", "Password is required.").exists()
], async (req, res) => {
  const errors = validationResult(req);

  // Check for errors
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if user exists
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email
      }
    });

    // User doesnt exist
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials." }] });
    }

    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Bad Password" }] });
    }

    const payload = {
      user: {
        id: user.id // this is given to cause its auto-generated in db (callback)
      }
    };

    jwt.sign(payload, jwtSecret, { expiresIn: 3600000 }, (err, token) => {
      if (err) throw err;

      res.json({ token });
    });
  } catch (error) {
    res.status(500).json(error);
  }

});

module.exports = router;

