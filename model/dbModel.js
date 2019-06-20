// Defines the entire database (two collections).  Using
// one file because the schemas are simple.

const mongoose = require("mongoose");

// Mongoose schema object.
const Schema = mongoose.Schema;

// Define the comment collection.
commentSchema =  new Schema({
    articleId: {
        type: String,
        trim: true,
        required: "Article Id is Required"
      },
    comment: {
        type: String,
        required: "Text is Required"
      },
});

// Article collection.
// Note: the article references the comment by database id.  
//  The comment just references the article id.
//
articleSchema = new Schema({
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
    image: {
        type: String,
        trim: true,
        required: "Image is Required"
      },
    hasComment: {
        type: Boolean,
        default: false,
      },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comments"
        }]
});


// Define the database collection and export so it can be used in other modules.
const Comments = mongoose.model("Comments", commentSchema);
const Articles = mongoose.model("Articles", articleSchema);

module.exports = { Comments, Articles };