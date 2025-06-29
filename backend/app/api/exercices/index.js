const { Router } = require('express')
const multer = require('multer')
const path = require('path')
const { Exercice } = require('../../models')
const manageAllErrors = require('../../utils/routes/error-management')
const logger = require('../../utils/logger.js')

const router = new Router()

// Config multer pour upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'))
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
    const exercice = Exercice.getExerciceById(req.params.idExercice)
    logger.info('Résultat trouvé :', exercice)
    res.status(200).json(exercice)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// envoie un nouvel exercice
router.post('/', (req, res) => {
  try {
    const exercice = Exercice.create({ ...req.body })
    res.status(201).json(exercice)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.put('/:idExercice', (req, res) => {
  const id = req.params.idExercice
  logger.info(`PUT /exercices/${id} called`)
  try {
    try {
      Exercice.getExerciceById(id)
    } catch (err) {
      if (err.name === 'NotFoundError') {
        logger.warn(`Exercice ${id} not found`)
        return res.status(404).json({ message: 'Exercice not found' })
      }
      throw err
    }

    const updated = Exercice.update(id, req.body)
    logger.info('Exercice updated:', updated)
    return res.status(200).json(updated)
  } catch (err) {
    logger.error('Error updating exercice:', err)
    return manageAllErrors(res, err)
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

// envoie une image et retourne le chemin
router.post('/uploads', upload.single('image'), (req, res) => {
  try {
    res.status(201).json({ imagePath: `/uploads/${req.file.filename}` })
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
