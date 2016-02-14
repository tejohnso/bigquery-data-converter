(function() {
const thisElementName = "bigquery-data-converter",
defaultAttributes = {
  projectId: "bigquery-projects-selector select",
  datasetId: "bigquery-datasets-selector select",
  tableId: "bigquery-tables-selector select"
};

const proto = Object.create(HTMLElement.prototype, {
  createdCallback: {
    value: function() {
      this.converter = convert.bind(this);

      Object.keys(defaultAttributes).forEach((attributeName)=>{
        this.setAttribute(attributeName,
        this.getAttribute(attributeName) || defaultAttributes[attributeName]);
      });

      Object.keys(defaultAttributes).forEach((key)=>{
        var el = document.querySelector(this.getAttribute(key));
        if (el) {
          el.addEventListener("change", this.converter);
        }
      });
    }
  },
  attributeChangedCallback: {
    value: function (name, oldVal, newVal) {
      if (!defaultAttributes.hasOwnProperty(name)) {return;}

      var oldEl = document.querySelector(oldVal);
      var newEl = document.querySelector(newVal);

      if (oldEl) {
        oldEl.removeEventListener("change", this.converter);
      }

      if (newEl) {
        newEl.addEventListener("change", this.converter);
      } 
    }
  }
});

document.registerElement(thisElementName, {prototype: proto});

function convert() {
  var conversionFn = chartJsLine;

  gapi.client.bigquery.tabledata.list({
    projectId: document.querySelector(this.getAttribute("projectId")).value,
    datasetId: document.querySelector(this.getAttribute("datasetId")).value,
    tableId: document.querySelector(this.getAttribute("tableId")).value,
    maxResults: 1000
  })
  .then((resp)=>{
    this.dispatchEvent(new CustomEvent("data", {detail: conversionFn(resp)}));
  }, (err)=>{
    this.dispatchEvent(new CustomEvent("error", {detail: err}));
  });

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
}

}());
