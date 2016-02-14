## Bigquery data converter
Converts bigquery from one data format to another.

Currently converts to chartjs line chart format from a table with the following schema:

x-axis-titles | data-set-1 | data-set-2 | data-set-3 | ...
:---: | :---: | :---: | :---: | :---:
x-title-1 | y-value-1 | y-value-2 | y-value-3 | ...
x-title-2 | y-value-1 | y-value-2 | y-value-3 | ...
x-title-3 | y-value-1 | y-value-2 | y-value-3 | ...
... | ... | ... | ...  
... | ... | ... | ...  
... | ... | ... | ...  

Note that the current row limit is 1000

### Usage
Requires *gapi.client* library (eg: [google-client-loader](https://elements.polymer-project.org/elements/google-apis)).  See the test section for a working example.  The element will emit event *data* when the data has been converted and will check for new data whenever any of the target elements change (see the *attributes* section below).  An *error* event will be dispatched when appropriate.

#### Attributes
Attribute Name | Description | Default
:---: | :---: | :---:
projectId | Selector whose target element *value* contains the project id | "bigquery-projects-selector select"
datasetId | Selector whose target element *value* contains the dataset id | "bigquery-datasets-selector select"
tableId | Selector whose target element *value* contains the table id | "bigquery-tables-selector select"
output | Output format | ChartJS Line

### Development set up
```
bower install bigquery-datasets-selector
cd bower_components
rm -rf bigquery-data-converter && git clone https://github.com/tejohnso/bigquery-data-converter.git
cd bigquery-data-converter
npm install
```

### Test

 - Expects Chrome via /usr/bin/google-chrome-stable
 - Requires an http server (eg: `npm install -g http-server`)

```
npm install -g http-server
npm install -g selenium-standalone
npm run setup-test-env
npm test
npm run teardown-test-env
```

### Enhancements

 - Allow direct population of source data or table id rather than using attributes.
