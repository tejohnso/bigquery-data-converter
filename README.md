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

### Usage
Requires *gapi.client* library (eg: [google-client-loader](https://elements.polymer-project.org/elements/google-apis)).  See the test section for a working example.

#### Attributes
Attribute Name | Description | Default
:---: | :---: | :---:
projectId | Project id or a selector whose target element *value* contains the project id | "bigquery-projects-selector select"
datasetId | Dataset id or a selector whose target element *value* contains the dataset id | "bigquery-datasets-selector select"
tableId | Table id or a selector whose target element *value* contains the table id | "bigquery-tables-selector select"
output | Output format | ChartJS Line
target | Selector which should receive the data | "x-chart"
attrib | Attribute which should be set on the target element | "config"

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

 - Emit onchange when data is changed so that target element/attrib isn't the only way to pass on the converted data.
