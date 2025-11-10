const { check } = require('express-validator');

const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];
exports.createCategoryValidator=[
    check('name')
        .notEmpty().withMessage('Category name is required')
        .isLength({min:3}).withMessage("Category name must be at least 3 characters")
        .isLength({max: 100}).withMessage("Category name must be at most 100 characters"),
    validatorMiddleware,
];
exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];
exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];