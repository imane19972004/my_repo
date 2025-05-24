const { Router } = require('express')
const UserRouter = require('./users')
const ExercicesRouter = require('./exercices')

const router = new Router()
router.get('/status', (req, res) => res.status(200).json('ok'))
router.use('/users', UserRouter)
router.use('/exercices', ExercicesRouter)

module.exports = router
