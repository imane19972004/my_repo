const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Simulation d'une base d'utilisateurs (remplace par ta vraie base)
const users = [
  {
    id: 1,
    email: 'user@example.com',
    passwordHash: '$2a$10$zM6jxwDlFcv1bYlA1M.6Mug1oAl6pk35uYTwBc6fAGpkmjxpjN1me' // mot de passe: "password123"
  }
];

// Route login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Utilisateur non trouvé' });

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).json({ error: 'Mot de passe incorrect' });

  // Générer token JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

  res.json({ token });
});

module.exports = router;
