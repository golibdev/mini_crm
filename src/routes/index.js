const router = require('express').Router();

router.use('/admin/', require('./adminRoute'));
router.use('/employee/', require('./employeeRoute'));
router.use('/position/', require('./positionRoute'));
router.use('/category/', require('./categoryRoute'));
router.use('/subcategory/', require('./subCategoryRoute'));
router.use('/newscount/', require('./newCountRoute'));
router.use('/task/', require('./taskRoute'));

module.exports = router;