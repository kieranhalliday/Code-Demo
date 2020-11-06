import { fileLoader } from "ejs";

// Column names
const colNames = [
    'INSURANCE COMPANY/GROUP PLAN',
    'INS PHONE #',
    'GROUP NUM',
    'PRIMARY/SECONDARY',
    'SENT',
    'SERVICE TRACER',
    'ON HOLD',
    'RE-SENT',
    'PATIENT NAME',
    'SUBSCRIBER',
    'ASSIGN OF BENEFITS',
    'ID NUM',
    'BIRTHDAY',
    'ESTIMATE',
    'CURRENT',
    '31-60',
    '61-90',
    '> 90',
    'TOTAL'
];

let allRows = [];
fileLoader('/aging-report-2.txt', (err, data) => {
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

