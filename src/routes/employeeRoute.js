const router = require('express').Router();
const { employeeController } = require('../controllers')
const { verifyAdminToken } = require('../handlers/adminTokenHandlers')

router.post('/register', verifyAdminToken, employeeController.register)
router.get('/', verifyAdminToken, employeeController.getAll)
router.get('/:id', employeeController.getOne)
router.put('/:id', verifyAdminToken, employeeController.update)
router.delete('/:id', verifyAdminToken, employeeController.delete)

module.exports = router