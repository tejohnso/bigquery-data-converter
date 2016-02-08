var webdriverio = require("webdriverio"),
assert = require("assert"),
options = {
  host: "localhost",
  port: 4444,
  desiredCapabilities: {
    browserName: "chrome",
    chromeOptions: {
      binary: "/usr/bin/google-chrome-stable"
    }
  }
},
timeForSeleniumInitialRun = 20000;

describe("end to end tests", function() {
  var client,
  id = require("./credentials.json").clientId,
  email = require("./credentials.json").email,
  pass = require("./credentials.json").pass;

  this.timeout(timeForSeleniumInitialRun);

  before(()=>{
    client = webdriverio.remote(options);
    return client.init()
    .then(()=>{return client.url("localhost:8080/bigquery-data-converter/test/importing-doc.html");})
    .then(()=>{return client.waitForExist("google-signin");})
    .then(()=>{return client.execute((id)=>{
      document.querySelector("google-signin").setAttribute("client-id", id);
    }, id)})
    .then(()=>{return client.waitForEnabled("google-signin");})
    .then(()=>{return client.click("google-signin");})
    .then(()=>{return client.getTabIds();})
    .then((ids)=>{return ids.pop()})
    .then((id)=>{return client.switchTab(id);})
    .then(()=>{return client.waitForExist("#Email", 10000);})
    .then(()=>{return client.setValue("#Email", email + "\n");})
    .then(()=>{return client.waitForExist("#Passwd", 10000);})
    .then(()=>{return client.waitForEnabled("#Passwd", 10000);})
    .then(()=>{return client.setValue("#Passwd", pass + "\n");})
    .then(()=>{return client.switchTab();})
    .then(()=>{return client.waitUntil(projectListingHasBeenRetrieved, 10000);})
    .then(()=>{return client.selectByIndex("bigquery-projects-selector", 1);})
    .then(()=>{return client.waitUntil(datasetsHaveBeenRetrieved, 10000);})
    .then(()=>{return client.selectByIndex("bigquery-datasets-selector", 1);})
    .then(()=>{return client.waitUntil(tablesHaveBeenRetrieved, 10000);});

    function projectListingHasBeenRetrieved() {
      return client.execute(function() {
        var selectElement = document.querySelector("bigquery-projects-selector select");
        if (!selectElement) {return {value: 0};}
        return selectElement.children.length;
      })
      .then((domResult)=>{
        if (domResult.value > 1) {
          console.log(`Project count: ${domResult.value}`);
        }

        return domResult.value > 1;
      });
    }

    function datasetsHaveBeenRetrieved() {
      return client.execute(function() {
        var selectElement = document.querySelector("bigquery-datasets-selector select");
        if (!selectElement) {return {value: 0};}
        return selectElement.children.length;
      })
      .then((domResult)=>{
        if (domResult.value > 1) {
          console.log(`Dataset count: ${domResult.value}`);
        }

        return domResult.value > 1;
      });
    }

    function tablesHaveBeenRetrieved() {
      return client.execute(function() {
        var selectElement = document.querySelector("bigquery-tables-selector select");
        if (!selectElement) {return {value: 0};}
        return selectElement.children.length;
      })
      .then((domResult)=>{
        if (domResult.value > 1) {
          console.log(`Dataset count: ${domResult.value}`);
        }

        return domResult.value > 1;
      });
    }
  });

  describe("Converter", function() {
    it("has the correct page title", ()=>{
      return client
      .getTitle()
      .then((title)=> {
        console.log("Title: " + title);
        assert.equal(title, "Bigquery Data Converter Test");
      });
    });

    xit("converts to the expected format for ChartJS Line", function() {
    });

    it("emits new-data", ()=>{
      return client.execute(()=>{
        document.querySelector("bigquery-data-converter").addEventListener("new-data", (e)=>{
          document.querySelector("bigquery-data-converter").setAttribute("dataEmitted", "true");
        });
      })
      .then(()=>{return client.selectByIndex("bigquery-tables-selector", 1);})
      .then(()=>{return client.waitUntil(newDataEmitted, 2000);})

      function newDataEmitted() {
        return client.execute(()=>{
          return document.querySelector("bigquery-data-converter").getAttribute("dataEmitted");
        })
        .then((domResult)=>{
          console.log(domResult);
          return domResult.value === "true";
        });
      }
    });
  });

  after(()=>{
    return client.end();
  });
});
