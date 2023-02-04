// From https://www.geeksforgeeks.org/how-to-share-code-between-node-js-and-the-browser/
// All the code in this module is enclosed in a closure.
(function (exports) {
  function hello() {
    console.log("called hello()...");
    return "Hello";
  }
  function getFromLocal(content) {
    //console.log("getFromLocal...");
    //console.log("the content: " + content);
    /*
    const obj = JSON.parse(content);
    const items = obj.message.items;
    for (var i = 0; i < items.length; i++) {
      var funder = items[i];
      id = funder.id;
      name = funder.name;
      console.log(id + " " + name);
    }
    */
    //printNames(content);
//    return "";
    return getNames(content);
//    return content;
  }
  function query(query) {
    var filter = "";
    if (query == "nih") {
      query = "National Institutes of Health";
      filter = "location:United+States";
    }
    var result = "";
    // https://api.crossref.org/swagger-ui/index.html#/Funders/get_funders
    //const url = "https://iqss.github.io/dataverse-installations/data/data.json";
    const encodedQuery = encodeURIComponent(query);
    const url =
      "https://api.crossref.org/funders?query=" + encodedQuery
     //     + "&filter=" + filter;
    fetch(url)
      .then((response) => response.text())
      .then((body) => {
        //console.log(body);
        printNames(body);
        result = body;
        return result;
      });
    console.log("query: " + query);
    console.log("url: " + url);
  }
  function printNames(content) {
    const obj = JSON.parse(content);
    const items = obj.message.items;
    for (var i = 0; i < items.length; i++) {
      var funder = items[i];
      id = funder.id;
      name = funder.name;
      // show details for just the first hit
      if (i < 1) {
        console.log(funder);
      }
      console.log(id + " " + name);
    }
  }
  function getNames(content) {
    var returnString = "";
    const obj = JSON.parse(content);
    const items = obj.message.items;
    for (var i = 0; i < items.length; i++) {
      var funder = items[i];
      id = funder.id;
      name = funder.name;
      // show details for just the first hit
      if (i < 1) {
        //console.log(funder);
      }
      console.log(id + " " + name);
      returnString += id + " " + name + "\n";
    }
    return returnString;
  }
  function getByRating(content) {
    let lines = "";
    var x = content.split("\r\n");
    for (var i = 0; i < x.length; i++) {
      y = x[i].split("\t");
      x[i] = y;
    }
    let byRating = {};
    x.shift(); // remove header ("Rating")
    for (const row of x) {
      let title = row[1];
      let rating = parseFloat(row[3]) * 10;
      if (byRating[rating] == undefined) {
        byRating[rating] = [];
      }
      byRating[rating].push(title);
    }
    for (const [rating, movies] of Object.entries(byRating)) {
      let stars = "";
      for (var i = 0; i < movies.length; i++) {
        lines += `${rating / 10}\t${movies[i]}\n`;
      }
    }
    lines = lines.replace(/\n+$/, "");
    return lines;
  }

  // Export the functions to exports.
  // In node.js this will be the module.exports.
  // In a browser this will be a function in the global object "libFunders".
  exports.hello = hello;
  exports.getFromLocal = getFromLocal;
  exports.query = query;
  exports.getByRating = getByRating;
  //})(typeof exports === "undefined" ? (this["asciiLib"] = {}) : exports);
})(typeof exports === "undefined" ? (this["libFunders"] = {}) : exports);
