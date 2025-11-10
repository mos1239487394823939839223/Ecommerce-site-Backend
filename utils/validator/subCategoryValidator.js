const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("SubCategory Required")
    .bail()
    .isLength({ min: 2 })
    .withMessage("the minimum length acceptable is : 2")
    .isLength({ max: 32 })
    .withMessage("The maximum length acceptable is 32"),
  check("category")
    .trim()
    .notEmpty()
    .withMessage("SubCatgory must belong to Category")
    .bail()
    .isMongoId()
    .withMessage("Invalid Category Id Format"),
  validatorMiddleware,
];
exports.updateSubCategoryValidator = [
  check("id").notEmpty()
  .isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];
exports.deleteSubCategoryValidator = [
  check("id").notEmpty()
  .isMongoId().withMessage("Invalid Subcategory id format"),
  validatorMiddleware,
];
