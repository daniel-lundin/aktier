var fs = require('fs');

function parse(data) {

  // Get rid of header
  var rows = data.split('\n');

  var stockRows = rows.slice(3, 10);

  var result = {
    stocks: {},
    yearTexts: []
  };

  stockRows.forEach(function(row) {
    var columns = row.split('\t');
    var stockName = columns.splice(0, 1)[0];

    if(stockName === "")
      return;

    result.stocks[stockName] = [];

    columns.forEach(function(value, index) {
      if (index === 0 || index === 16)
        return;
      result.stocks[stockName].push(parseInt(value, 10));
    });
  });

  var yearTextsHeadings = rows[35].split('\t');
  var yearTextsDescriptions = rows[36].split('\t');
  
  yearTextsHeadings.forEach(function(heading, index) {
    if(index === 0 || index === 1) {
      return;
    }

    result.yearTexts.push({
      heading: heading,
      description: yearTextsDescriptions[index]
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
  fs.writeFile('src/assets/data.json', JSON.stringify(parsed, null, 2), function() {
    console.log('src/assets/data.json written.');
  });
});
