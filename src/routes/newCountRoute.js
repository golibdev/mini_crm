const router = require('express').Router();
const { verifyEmployeeToken } = require('../handlers/employeeTokenHandlers')
const { newsCountController } = require('../controllers')

router.post('/', verifyEmployeeToken, newsCountController.create)
router.delete('/:id', verifyEmployeeToken, newsCountController.delete)

module.exports = router