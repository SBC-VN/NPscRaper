// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const mongoose = require("mongoose");

// Sets up the Express App
// =============================================================
const app = express();
let PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nprscraper";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
// Run the site!
// =============================================================
app.listen(PORT, function() {
  console.log("Npr Scraper listening on http://localhost:" + PORT);
});

