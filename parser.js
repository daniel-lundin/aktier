var fs = require('fs');

function parse(data) {

  // Get rid of header
  var rows = data.split('\n');
  rows = rows.splice(1);

  var result = {};

  rows.forEach(function(row) {
    var columns = row.split('\t');
    var stockName = columns.splice(0, 1)[0];

    if(stockName === "")
      return;

    result[stockName] = [];

    columns.forEach(function(value, index) {
      if (index === 0 || index === 16)
        return;
      result[stockName].push(parseInt(value, 10));
    });
  });

  return result;
}

fs.readFile('data.tsv', 'utf-8', function(err, data) {
  if(err) {
    console.log('error reading data');
    process.exit(1);
  }

  var parsed = parse(data);
  fs.writeFile('src/assets/data.json', JSON.stringify(parsed), function() {
    console.log('src/assets/data.json written.');
  });
});
