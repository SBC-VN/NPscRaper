// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

const mongoose = require("mongoose");
const articleItems = require("../model/articleModel.js");


function scrapeArticle(article) {
    axios.get(article.href).then(function(response) {
        let $ = cheerio.load(response.data);
        let storyTextDiv = $("#storytext");
        article.text = [];
        $(storyTextDiv).children('p').each(function(i, element) {
             if ($(element).attr("class") == undefined) {
                article.text.push($(element).text());
             }
        });
        articleItems.create(article).then(function(dbItem) {
            console.log("Add ",article.articleId);
        });                             
    });
}

function checkArticle(article) {
    articleItems.find({articleId : article.articleId})
                .then(function(foundItem) {
                    if (foundItem.length == 0) {
                        scrapeArticle(article);
                    }
                });
            }

function scrapeHeadlines(webPath) {
    axios.get(webPath).then(function(response) {
        let $ = cheerio.load(response.data);
        $('article').each(function(i, element) {
            article = {};
            article.articleId = $(element).attr('id');

            let storyTextDiv = $(element).find($('.story-text'));
            let storyAnchorLinks = $(storyTextDiv).children('a');
            if (storyAnchorLinks.length == 2) {
                let titleLink = storyAnchorLinks[0];
                article.href = $(titleLink).attr('href');
                article.title = $(titleLink).text();
                let bodyLink = storyAnchorLinks[1];
                article.summary = $(bodyLink).text();
                checkArticle(article);
            }
            // else {
            //     console.log("No story anchors");
            // }
        });
    });
}

module.exports = function(app) {
    // Start the scrape.
    app.post("/api/scrape", function(req, res) {
        scrapeHeadlines("https://www.npr.org/");
        res.json({status: "ok"});
    });
  };