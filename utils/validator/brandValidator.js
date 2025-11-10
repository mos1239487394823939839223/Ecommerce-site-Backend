const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware,
];
exports.createBrandValidator=[
    check('name').notEmpty().withMessage('Brand Required').isLength({min:3}).withMessage("the minimum length acceptable is : 3")
    .isLength({max: 20}).withMessage("The maximum length acceptable is 20"),
    validatorMiddleware,
];
exports.updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware,
];
exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid brand id format'),
    validatorMiddleware,
];