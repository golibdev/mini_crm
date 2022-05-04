const router = require('express').Router();
const { verifyAdminToken } = require('../handlers/adminTokenHandlers')
const { verifyEmployeeToken } = require('../handlers/employeeTokenHandlers')
const { taskController } = require('../controllers')

router.get('/', verifyAdminToken, taskController.getAll)
router.get('/:id', verifyAdminToken, taskController.getOne)
router.post('/', verifyAdminToken, taskController.create)
router.delete('/:id', verifyAdminToken, taskController.delete)
router.put('/change-status/:id', taskController.changeStatus)

module.exports = router;