const { Router } = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { User } = require('../../models')
const UserHistoryRouter = require('./user-history')
const manageAllErrors = require('../../utils/routes/error-management')
const logger = require('../../utils/logger.js')

const router = new Router()
router.use('/:idUser/history', UserHistoryRouter)

// Récupérer tous les utilisateurs
router.get('/', (req, res) => {
  try {
    const users = User.get()
    res.status(200).json(users)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Récupérer un utilisateur par ID
router.get('/:idUser', (req, res) => {
  try {
    const user = User.getById(req.params.idUser)
    res.status(200).json(user)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Modifier un utilisateur
router.put('/:idUser', (req, res) => {
  try {
    const updatedUser = User.update(req.params.idUser, req.body)
    res.status(200).json(updatedUser)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Supprimer un utilisateur
router.delete('/:idUser', (req, res) => {
  try {
    User.delete(req.params.idUser)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

const uploadDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage })

// Créer un nouvel utilisateur avec ou sans photo
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    logger.info('REQ BODY:', req.body)
    logger.info('REQ FILE:', req.file)

    const userData = { ...req.body }

    if (req.file) {
      userData.photoUrl = `/uploads/${req.file.filename}`
    }
    logger.info(userData)
    const user = await User.create(userData)
    res.status(201).json(user)
  } catch (error) {
    logger.error('Erreur lors de la création de l\'utilisateur :', error)
    res.status(500).json({ message: 'Erreur serveur', error })
  }
})


module.exports = router
