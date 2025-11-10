const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
  name: {
    type : String,
    required : [true , "Brand required"],
    unique : true,
    minlength : [3, "The minimum length acceptable is : 3"],
    maxlength : [20 , "The Maximum Length for the name is : 20"]
  },
  slug : {
    type : String,
    lowercase : true
  },
  image : String
},{ timestamps : true});

module.exports = mongoose.model("Brand", brandSchema);