var express = require('express')
var router = express.Router()

var { validate } = require('../../controllers/validators/users.validator')
var { authenticate } = require('../../middleware/auth.middleware')

var controller = require('../../controllers/users.controller')

router.get('/', controller.index)
router.post('/', validate('register'), controller.register)
router.delete('/:id', [authenticate, validate('remove')], controller.remove)

module.exports = router
