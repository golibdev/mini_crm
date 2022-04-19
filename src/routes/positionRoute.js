const router = require('express').Router();
const { verifyAdminToken } = require('../handlers/adminTokenHandlers');
const { positionController } = require('../controllers')

router.get('/', verifyAdminToken, positionController.getAll);
router.get('/:id', verifyAdminToken, positionController.getOne);
router.post('/', verifyAdminToken, positionController.create);
router.put('/:id', verifyAdminToken, positionController.update);
router.delete('/:id', verifyAdminToken, positionController.delete);

module.exports = router