const { Router } = require('express')
const { User } = require('../../models')
const UserHistoryRouter = require('./user-history')
const manageAllErrors = require('../../utils/routes/error-management')

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

// Créer un nouvel utilisateur
router.post('/', (req, res) => {
  try {
    const user = User.create({ ...req.body })
    res.status(201).json(user)
  } catch (err) {
    manageAllErrors(res, err)
  }
})

// Modifier un utilisateur
router.put('/:idUser', (req, res) => {
  try {
    const userExists = User.getById(req.params.idUser)
    console.log(userExists)
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

module.exports = router
