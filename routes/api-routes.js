// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");

function scrapeArticle(webPath) {
    console.log("Scraping article",webPath);
    axios.get(webPath).then(function(response) {
        let $ = cheerio.load(response.data);
        $('p').each(function(i, element) {
            console.log($(element).text());
        });
    });
}

function scrapeHeadlines(webPath) {
    axios.get(webPath).then(function(response) {
        let $ = cheerio.load(response.data);
        $('article').each(function(i, element) {
            let storyId = $(element).attr('id');
            console.log(" ");
            console.log(" ");
            console.log('Story id',storyId);
            let storyTextDiv = $(element).find($('.story-text'));
            let storyAnchorLinks = $(storyTextDiv).children('a');
            if (storyAnchorLinks.length == 2) {
                let titleLink = storyAnchorLinks[0];
                let titleHref = $(titleLink).attr('href');
                let titleText = $(titleLink).text();
                console.log("Title HREF",titleHref);
                console.log("Title text",titleText);
                let bodyLink = storyAnchorLinks[1];
                let bodyText = $(bodyLink).text();
                console.log("body text",bodyText);
                scrapeArticle(titleHref);
            }
        });
    });
}

scrapeHeadlines("https://www.npr.org/");