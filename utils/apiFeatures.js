class ApiFeatures {
  constructor(queryString, mongooseQuery) {
    this.queryString = queryString || {};
    this.mongooseQuery = mongooseQuery;
  }

  filter() {
    // Normalize bracketed query params like ratingsAverage[gte]=4.3 into nested objects
    const queryStringObj = {};
    Object.entries(this.queryString || {}).forEach(([key, val]) => {
      const match = key.match(/^(.+)\[(.+)\]$/);
      if (match) {
        const field = match[1];
        const operator = match[2];
        if (!queryStringObj[field]) queryStringObj[field] = {};
        queryStringObj[field][operator] = val;
      } else {
        queryStringObj[key] = val;
      }
    });

    const excludesFields = ["page", "sort", "limit", "fields", "keyword"];
    excludesFields.forEach((field) => delete queryStringObj[field]);

    // replace operators (gte, gt, lte, lt) with Mongo-style $operators
    let queryString = JSON.stringify(queryStringObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const filterObject = JSON.parse(queryString);

    // apply filter
    this.mongooseQuery = this.mongooseQuery.find(filterObject);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const { keyword } = this.queryString;
      const searchQuery = {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      };
      // merge search with existing conditions by using find with the searchQuery
      this.mongooseQuery = this.mongooseQuery.find(searchQuery);
    }
    return this;
  }
}

module.exports = ApiFeatures;
