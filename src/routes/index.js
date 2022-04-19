const router = require('express').Router();

router.use('/admin/', require('./adminRoute'));
router.use('/employee/', require('./employeeRoute'));
router.use('/position/', require('./positionRoute'));
router.use('/category/', require('./categoryRoute'));
router.use('/subcategory/', require('./subCategoryRoute'));
router.use('/newsCount/', require('./newCountRoute'));

module.exports = router;