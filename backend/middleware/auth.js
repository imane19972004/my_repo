const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token manquant' });

  const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on ajoute l’info user au req
    next();
  } catch (e) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};

module.exports = auth;


// Maintenant, on va protéger une route avec ce middleware pour vérifier que seuls les utilisateurs connectés peuvent y accéder