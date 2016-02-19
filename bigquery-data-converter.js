(function() {
const thisElementName = "bigquery-data-converter",
maxResults = 1000,
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

function convert(data) {
  var conversionFn = chartJsLine,
  projectId = document.querySelector(this.getAttribute("projectId")).value,
  datasetId = document.querySelector(this.getAttribute("datasetId")).value,
  tableId = document.querySelector(this.getAttribute("tableId")).value;

  if (data.kind === "bigquery#queryResponse") {return conversionFn(data);}
  if (!projectId || !datasetId || !tableId) {return;}

  gapi.client.bigquery.jobs.query({
    timeoutMs: 90000,
    maxResults,
    projectId,
    query: `select * from ${datasetId}.${tableId} limit ${maxResults}`
  })
  .then((resp)=>{
    if (!resp.result.jobComplete) {
      return this.dispatchEvent(new CustomEvent("error", {detail: "not complete"}));
    }
    this.dispatchEvent(new CustomEvent("data", {detail: conversionFn(resp.result)}));
  }, (err)=>{
    this.dispatchEvent(new CustomEvent("error", {detail: err}));
  });

  function chartJsLine(data) {
    var labels = [],
    datasets = [];
    
    data.schema.fields.slice(1).forEach((field)=>{
      datasets.push({
        "label": field.name,
        "fillColor": "rgba(220,220,220,0.2)",
        "strokeColor": "rgba(220,220,220,1)",
        "pointColor": "rgba(220,220,220,1)",
        "pointStrokeColor": "#fff",
        "pointHighlightFill": "#fff",
        "pointHighlightStroke": "rgba(220,220,220,1)",
        "data": []
      });
    });

    data.rows.forEach((row)=>{
      labels.push(row.f[0].v);
      row.f.slice(1).forEach((set, idx)=>{
        datasets[idx].data.push(set.v);
      });
    });

    return {labels, datasets};
  }
}
}());
