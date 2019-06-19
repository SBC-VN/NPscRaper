const mongoose = require("mongoose");

// Mongoose schema object.
const Schema = mongoose.Schema;

// Define a schema to store portfolio information.
const articleModel = new Schema({
    articleId: {
        type: String,
        trim: true,
        required: "Article Id is Required"
      },
    href: {
        type: String,
        trim: true,
        required: "Href is Required"
      },
    title: {
        type: String,
        trim: true,
        required: "Title is Required"
      },
    text: {
        type: [String],
        required: "Text is Required"
      },
});

const articleModel = mongoose.model("articleModel", articleModel);

// Export the model
module.exports = articleModel;