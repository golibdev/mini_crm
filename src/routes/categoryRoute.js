const router = require('express').Router();
const { categoryController } = require('../controllers')
const { verifyAdminToken } = require('../handlers/adminTokenHandlers')

router.get('/', categoryController.getAll)
router.get('/:id',categoryController.getOne)
router.post('/', categoryController.create)
router.put('/:id', categoryController.update)
router.delete('/:id', categoryController.delete)

module.exports = router