const { Router } = require('express')
const userController = require('../controllers/userController')

const router = Router()

router.get('/userDetails', userController.userDetails)



module.exports = router