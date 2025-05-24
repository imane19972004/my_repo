const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const { Exercice } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')

const router = new Router()

// Config multer (upload d'images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads')) // dossier à exposer publiquement
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({ storage })

// Routes Exercice

// GET tous les exercices
router.get('/', (req, res) => {
  try {
    const exercices = Exercice.get()
    res.status(200).json(exercices)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// GET un exercice par ID
router.get('/:idExercice', (req, res) => {
  try {
    const exercice = Exercice.getById(req.params.idExercice)
    res.status(200).json(exercice)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// POST un nouvel exercice
router.post('/', (req, res) => {
  try {
    const exercice = Exercice.create({ ...req.body })
    res.status(201).json(exercice)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// PUT modifier un exercice
router.put('/:idExercice', (req, res) => {
  try {
    Exercice.getById(req.params.idExercice) // vérification existence
    const updated = Exercice.update(req.params.idExercice, req.body)
    res.status(200).json(updated)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// DELETE un exercice
router.delete('/:idExercice', (req, res) => {
  try {
    Exercice.delete(req.params.idExercice)
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// POST /upload (envoie une image et retourne le chemin)
router.post('/uploads', upload.single('image'), (req, res) => {
  try {
    res.status(201).json({ imagePath: `/uploads/${req.file.filename}` })
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
