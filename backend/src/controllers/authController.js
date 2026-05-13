const { User } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Vale email või parool!' });
    }

    // Kontrollime parooli (praegu plaintext, hiljem bcrypt)
    if (user.passwordHash !== password) {
      return res.status(401).json({ error: 'Vale email või parool!' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Serveri viga!' });
  }
};

module.exports = { login };