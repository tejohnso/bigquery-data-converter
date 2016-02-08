const thisElementName = "bigquery-data-converter",
defaultAttributes = {
  projectId: "bigquery-projects-selector select",
  datasetId: "bigquery-datasets-selector select",
  tableId: "bigquery-tables-selector select"
};

const conv = Object.create(HTMLElement.prototype, {
  createdCallback: {
    value: function() {
      Object.keys(defaultAttributes).forEach((attributeName)=>{
        this.setAttribute(attributeName, this.getAttribute(attributeName) || defaultAttributes[attributeName]);
      });

      var sourceEl = document.querySelector(this.getAttribute("tableId"));
      if (sourceEl) {
        sourceEl.addEventListener("change", convert.bind(this));
      }
    }
  },
  attributeChangedCallback: {
    value: function (name, oldVal, newVal) {
      if (name !== "tableId") {return;}

      var oldEl = document.querySelector(oldVal);
      var newEl = document.querySelector(newVal);

      if (oldEl) {
        oldEl.removeEventListener("change", convert.bind(this));
      }

      if (newEl) {
        newEl.addEventListener("change", convert.bind(this));
      } 
    }
  }
});

document.registerElement(thisElementName, {prototype: conv});

function convert() {
  var converter = chartJsLine;

  gapi.client.bigquery.tabledata.list({
    projectId: document.querySelector(this.getAttribute("projectId")).value,
    datasetId: document.querySelector(this.getAttribute("datasetId")).value,
    tableId: document.querySelector(this.getAttribute("tableId")).value,
    maxResults: 1000
  })
  .then((resp)=>{
    this.dispatchEvent(new CustomEvent("new-data", {detail: converter(resp)}));
  });
}

function chartJsLine(data) {
  return {
    "labels": ["January", "February", "March", "April", "May", "June", "July"],
    "datasets": [
      {
        "label": "My First dataset",
        "fillColor": "rgba(220,220,220,0.2)",
        "strokeColor": "rgba(220,220,220,1)",
        "pointColor": "rgba(220,220,220,1)",
        "pointStrokeColor": "#fff",
        "pointHighlightFill": "#fff",
        "pointHighlightStroke": "rgba(220,220,220,1)",
        "data": [65, 59, 80, 81, 56, 55, 40]
      },
      {
        "label": "My Second dataset",
        "fillColor": "rgba(151,187,205,0.2)",
        "strokeColor": "rgba(151,187,205,1)",
        "pointColor": "rgba(151,187,205,1)",
        "pointStrokeColor": "#fff",
        "pointHighlightFill": "#fff",
        "pointHighlightStroke": "rgba(151,187,205,1)",
        "data": [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };
}
