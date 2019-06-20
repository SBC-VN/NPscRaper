// Require axios and cheerio. This makes the scraping possible
const axios = require("axios");
const cheerio = require("cheerio");

const mongoose = require("mongoose");
const db = require("../model/dbModel.js");

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
        article.hasComment = false;
        db.Articles.create(article).then(function(dbItem) {
            console.log("Add ",article.articleId);
            //console.log("item",dbItem);
            // dbItem is the item that was just added. ie: article.
        });                             
    });
}

function checkArticle(article) {
    db.Articles.find({articleId : article.articleId})
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
                let imageWrapper = $(element).find($('.imagewrap'));
                if (imageWrapper != undefined) {                    
                    let imgSrc = $(imageWrapper).find('img');
                    if (imgSrc != undefined) {
                        article.image = $(imgSrc).attr('src');

                        // Only check/add the article if we have everything (including an image).
                        checkArticle(article);
                    }
                }                
            }
            // else {
            //     console.log("No story anchors");
            // }
        });
    });
}

// 
// Function that adds a comment to an existing article.
//
function addComment(articleId, comment)
{
    console.log("Add comment", articleId);
    db.Comments.create({articleId, comment})
        .then(function(dbItem) {
            //console.log("Chain update",dbItem);
            db.Articles.updateOne({
                                articleId: articleId
                            },
                            {
                                $set: {
                                        hasComment : true
                                },
                                $push: {
                                    comments : dbItem._id
                                }
                            },
                            function(error, edited) {
                                if (error) {
                                    console.log("Update Article error " + articleId, error);
                                }
                                else {
                                    console.log("Updated",articleId);
                                };
                            }
            );
        });
        // This will return before the update is complete.
        return({status : "ok"});
    }          
    
// 
// Function that updates the text of an existing comment.
//
function updateComment(commentId, comment)
{
    console.log("Update comment", commentId);
    db.Comments.updateOne(  { _id : commentId },
                            {
                                $set: { comment }
                            },
                            function(error, edited) {
                                if (error) {
                                    console.log("Update Comment error " + commentId, error);
                                }
                                else {
                                    console.log("Updated",commentId);
                                };
                            }
            );
        // This will return before the update is complete.
        return({status : "ok"});
    }  

// 
// Function that updates the text of an existing comment.
//
function deleteComment(commentId)
{
    console.log("Delete comment", commentId);
    db.Comments.deleteOne(  { _id : commentId },
                         function(error, edited) {
                                if (error) {
                                    console.log("Remove Comment error " + commentId, error);
                                }
                                else {
                                    console.log("Removed",commentId);
                                };
                            }
            );
        // This will return before the update is complete.
        return({status : "ok"});
    }  

module.exports = function(app) {
    // Start the scrape.
    app.post("/api/scrape", function(req, res) {
        scrapeHeadlines("https://www.npr.org/");
        res.json({status: "ok"});
    });

    app.post("/api/comment/add/:articleId", function(req, res) {
        res.json(addComment(req.params.articleId,req.body.comment));
    });

    app.post("/api/comment/update/:commentId", function(req, res) {
        res.json(updateComment(req.params.commentId,req.body.comment));
    });

    app.post("/api/comment/delete/:commentId", function(req, res) {
        res.json(deleteComment(req.params.commentId));
    });
  };