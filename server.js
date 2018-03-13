// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");
var port = process.env.PORT || 8080;
// Initialize Express
var app = express();

// Set up a static folder (public) for our web app
app.use(express.static("public"));

// Database configuration
// Save the URL of our database as well as the name of our collection
var databaseUrl = "mongodb://mckayma2:test1234@ds213239.mlab.com:13239/heroku_858jb8c9";
var collections = ["news"];

// Use mongojs to hook the database to the db variable
var db = mongojs(databaseUrl, collections);

// This makes sure that any errors are logged if mongodb runs into an issue
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Routes
// 1. At the root path, send a simple hello world message to the browser
app.get("/", function(req, res) {
  res.send("Hello world");
});

// 2. At the "/all" path, display every entry in the animals collection

// 3. At the "/name" path, display every entry in the animals collection, sorted by name
app.get("/articles", function(req, res) {
  // Query: In our database, go to the animals collection, then "find" everything,
  // but this time, sort it by name (1 means ascending order)
  db.news.find().sort({ article: 1 }, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }

  });
});

// Make a request call to grab the HTML body from the site of your choice
request("http://www.nytimes.com", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("h2.story-heading").each(function(i, element) {

    var link = $(element).children().attr("href");
    var title = $(element).children().text();

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results[0].title);
 //to drop news collection
db.news.drop();
//db.createCollection("news");
 for(i=0; i < results.length; i++){
 
    if(results[i].title != null && results[i].link !=null){
     db.news.insert({"article":results[i].title, "link": results[i].link});
    }
}

});


//server listening 
app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});
