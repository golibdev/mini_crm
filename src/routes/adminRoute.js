const router = require('express').Router();
const { adminController } = require('../controllers');
const { verifyAdminToken } = require('../handlers/adminTokenHandlers');

router.post('/login', adminController.login);
router.get('/summary', adminController.summary);

module.exports = router;