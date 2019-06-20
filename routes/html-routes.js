// Dependencies
// =============================================================
const path = require("path");
const mongoose = require("mongoose");
const db = require("../model/dbModel.js");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  app.get("/", function(req, res) {
    db.Articles.find({}).sort({articleId:1})
                        .populate("comments")
                        .then(function(dbItems) {
                          res.render("display", {dbItems});
                        })
  });
  

  // Each of the routes below this provide (private) items that the website needs
  // such as css, images, etc.

  // CSS file route
  app.get("/resources/css/:file", function(req, res) {
    // __dirname = ..\Portfolio\routes
    var reqfile = path.join(__dirname, "../resources/css/" + req.params.file);
    res.sendFile(reqfile);
  });

  // Image file route
  app.get("/resources/img/:file", function(req, res) {
    // __dirname = ..\Portfolio\routes
    var reqfile = path.join(__dirname, "../resources/img/" + req.params.file);
    res.sendFile(reqfile);
  });

  // Script file route
  app.get("/resources/script/:file", function(req, res) {
    // __dirname = ..\Portfolio\routes
    var reqfile = path.join(__dirname, "../resources/script/" + req.params.file);
    res.sendFile(reqfile);
  });
};
