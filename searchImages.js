var Scraper = require("images-scraper");

const google = new Scraper({});

(async () => {
  const results = await google.scrape("query", 25);
  console.log("results", results[20]);
})();
