const router = require('express').Router();
const { adminController } = require('../controllers');

router.post('/login', adminController.login);
router.get('/summary', adminController.summary);

module.exports = router;