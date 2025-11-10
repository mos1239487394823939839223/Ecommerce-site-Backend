const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type : String,
    required : [true , "Category required"],
    unique : true,
    minlength : [3, "Category name must be at least 3 characters"],
    maxlength : [100 , "Category name must be at most 100 characters"]
  },
  slug : {
    type : String,
    lowercase : true
  },
  image : String
},{ timestamps : true});
const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;