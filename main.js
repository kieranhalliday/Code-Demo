// Initial testing ground for reading the file
let allRows = [];
fs.readFile('/aging-report-2.txt', (err, data) => {
    if (err) throw err;

    allRows = data.toString().split("\n");

    // ignore first 3 rows because they are meta data
    allRows.splice(0,3);

    let allData = {};

    allRows.forEach((row, outerIndex) => {
        const r = row.split("\t");
        r.forEach((value, index) => {
            // If the row is an empty row, ignore it
            if (!row) {
                return;
            }
            if (!allData[outerIndex]) {
                allData[outerIndex] = {};
            }
            allData[outerIndex][colNames[index]] = value;
        });
    });

    console.log(allData)
});

