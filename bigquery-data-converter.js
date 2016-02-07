(function() {
  const conv = Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
      }
    },
    addtributeChangedCallback {
      value: function (name, oldVal, newVal) {
      }
    }
  });

  document.registerElement("bigquery-data-converter", {prototype: conv});
}());
