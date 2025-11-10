const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("product required"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 2000 })
    .withMessage("Too Long Description"),
  check("quantity")
    .notEmpty()
    .withMessage("product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .isNumeric()
    .withMessage("Number of Sold prodduct must be a number")
    .optional(),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),

  check("priceAfterDescount")
    .isNumeric()
    .optional()
    .isNumeric()
    .toFloat()
    .withMessage("The price after sold must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("PriceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("available colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Image cover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of strings"),
  check("category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .custom(async (categoryId) => {
      const category = await categoryModel.findById(categoryId);

      if (!category) {
        throw new Error(`No category found for this id: ${categoryId}`);
      }

      return true;
    }),
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((subCategoriesID) =>subCategoryModel.find({_id: {$exists :true , $in : subCategoriesID}}).then(
      (result)=>{
        if(result.length<1 || result.length< subCategoriesID){
          return Promise.reject(
            new Error ("Invalid SubCategories Ids")
          )
        }
      }
    ))
    .custom((val, {req})=>
      subCategoryModel.find({category: req.body.category}).then((subcategories)=>{
        const subCategoriesIdInDB =[];
        subcategories.forEach((subCategoryID)=>{
          subCategoriesIdInDB.push(subCategoryID._id.toString());
        })
        const checker = val.every((v)=>subCategoriesIdInDB.includes(v));
        console.log(checker)
        if(!checker){
          return Promise.reject(new Error(`SubCategories are not part of the main category that has Id : ${req.body.category}`))
        }
      })
    )
    ,
  check("brand").isMongoId().withMessage("Invalid ID formate").optional(),
  check("ratingsAverage")
    .isNumeric()
    .withMessage("RatingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal to 1.0")
    .isLength({ max: 5 })
    .withMessage("RatingsAverage must be below or equal to 5")
    .optional(),
  check("ratingsQuntaty")
    .optional()
    .isNumeric()
    .withMessage("Rating Quantity must b a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID format"),
  validatorMiddleware,
];

exports.updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];
