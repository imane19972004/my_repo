const router = require('express').Router({ mergeParams: true })
const { UserExerciseList } = require('../../../models')
const manageAllErrors = require('../../../utils/routes/error-management')
const logger = require('../../../utils/logger.js')

// GET exercices assignés à un utilisateur
router.get('/', (req, res) => {
  try {
    const { idUser } = req.params
    const userList = UserExerciseList.get().find((e) => e.userId === idUser)
    res.status(200).json(userList || { userId: idUser, userExerciceList: [] })
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// POST assigner un ou plusieurs exercices à un utilisateur
router.post('/', (req, res) => {
  try {
    const { idUser } = req.params
    const { userId, userExerciceList } = req.body

    logger.info('params:', req.params)
    logger.info('body:', req.body)

    if (!userId || userId !== idUser) {
      return res.status(400).json({ error: 'UserId manquant ou incorrect.' })
    }
    if (!Array.isArray(userExerciceList) || userExerciceList.length === 0) {
      return res.status(400).json({ error: 'La liste userExerciceList doit être un tableau non vide.' })
    }
    let list = UserExerciseList.get().find((e) => e.userId === idUser) // la liste existante

    if (!list) {
      list = UserExerciseList.create({ userId: idUser, userExerciceList })
    } else {
      const existingIds = new Set((list.userExerciceList || []).map((e) => e.id))
      const newUniqueExercises = userExerciceList.filter((e) => !existingIds.has(e.id))

      if (newUniqueExercises.length === 0) {
        return res.status(409).json({ error: 'Tous les exercices sont déjà attribués à cet utilisateur.' })
      }

      list.userExerciceList = (list.userExerciceList || []).concat(newUniqueExercises)
      UserExerciseList.update(list.id, list)
    }

    res.status(201).json(list)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// DELETE retirer un exercice
router.delete('/:idExercice', (req, res) => {
  try {
    const { idUser, idExercice } = req.params
    const list = UserExerciseList.get().find((e) => e.userId === idUser)

    if (!list) throw new Error('UserExerciseList not found')

    list.userExerciceList = list.userExerciceList.filter((ex) => String(ex.id) !== idExercice);
    UserExerciseList.update(list.id, list)

    res.status(200).json(list)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
