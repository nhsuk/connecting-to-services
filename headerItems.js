const request = require('request');
var fs = require('fs');
var output = "";

request('https://refdata-api.azurewebsites.net/api/fullheadermenu', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var topLevel = JSON.parse(body);
    for(var i = 0; i < topLevel.length; i++) {
      var item = topLevel[i];
      var itemURL = item.URL.split(",")
          itemURL = itemURL[0].replace('site','www.nhs.uk');
      var subItems = item.Submenus;
      output += '<li class=""><a href="'+itemURL+'">'+item.Title+'</a>';
      if (subItems.length != 0) {
        output += '<ul>';
        for(var a = 0; a < subItems.length; a++) {
          var subItem = subItems[a];
          var subItemURL = subItem.URL.split(",")
              subItemURL = subItemURL[0].replace('site','www.nhs.uk');
          output += '<li class=""><a href="'+subItemURL+'">'+subItem.Title+'</a>';
        }
        output += '</ul>';
      }
      output += '</li>';
    }
    fs.writeFile("app/views/includes/header-items.nunjucks", output, (err) => {
      if (err) throw err;

      console.log("The file was succesfully saved!");
    });
  } else {
    console.warn(error);
  }


});
