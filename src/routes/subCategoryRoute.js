const router = require('express').Router();
const { verifyAdminToken } = require('../handlers/adminTokenHandlers');
const { subCategoryController } = require('../controllers')

router.get('/', verifyAdminToken, subCategoryController.getAll);
router.get('/:id', verifyAdminToken, subCategoryController.getOne);
router.post('/', verifyAdminToken, subCategoryController.create);
router.put('/:id', verifyAdminToken, subCategoryController.update);
router.delete('/:id', verifyAdminToken, subCategoryController.delete);

module.exports = router