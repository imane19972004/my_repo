const { Router } = require('express')
const { UserHistory } = require('../../../models')
const manageAllErrors = require('../../../utils/routes/error-management')

const router = new Router({ mergeParams: true })

router.get('/', (req, res) => {
  try {
    const userHistory = UserHistory.get().filter(h => h.userId === req.params.idUser)
    res.status(200).json(userHistory)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.post('/', (req, res) => {
  try {
    const newHistoryEntry = {
      ...req.body,
      userId: req.params.idUser,
    }
    const createdEntry = UserHistory.create(newHistoryEntry)
    res.status(201).json(createdEntry)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

router.delete('/', (req, res) => {
  try {
    const userHistories = UserHistory.get().filter(h => h.userId === req.params.idUser)
    userHistories.forEach(h => UserHistory.delete(h.id))
    res.status(204).end()
  } catch (err) {
    manageAllErrors(res, err)
  }
})

module.exports = router
