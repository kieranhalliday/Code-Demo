import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  // Setting column names and order
  displayedColumns = [Constants.colNames[9], Constants.colNames[13], Constants.colNames[14],
  Constants.colNames[15], Constants.colNames[16], Constants.colNames[17], Constants.colNames[18]];

  allRows = [];
  allData = [];
  amountOutstanding = 0;
  averageOutstanding = 0;
  dataSource = new MatTableDataSource();

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.readFile(Constants.fileName);
  }

  readFile(url: string): void {
    // Reset all counters
    this.amountOutstanding = 0;
    this.averageOutstanding = 0;

    this.http.get(url, { responseType: 'text' })
      .subscribe(data => {
        this.allRows = data.toString().split('\n');

        // ignore first 3 rows because they are meta data
        this.allRows.splice(0, 3);

        this.allRows.forEach((row, outerIndex) => {
          // Replace weird formatting
          const r = row.replace('\t\t', '\t').split('\t');
          r.forEach((value, index) => {
            // If the row is an empty row, ignore it
            if (!!row) {
              if (!this.allData[outerIndex]) {
                this.allData[outerIndex] = {};
              }
              this.allData[outerIndex][Constants.colNames[index]] = value;

              if (index === Constants.colNames.indexOf('TOTAL')) {
                this.amountOutstanding += parseInt(value, 10);
              }
            } else {
              // Remove blank rows so they don't ruin average calculations
              // These rows are just carriage returns
              this.allRows.splice(this.allRows.indexOf(r), 1);
            }
          });
        });

        this.averageOutstanding = parseFloat((this.amountOutstanding / this.allRows.length).toFixed(2));
        this.dataSource = new MatTableDataSource(this.allData);
      });
  }

  // Adds commas and makes large numbers look nicers
  prettify(value): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  sortData(sort: Sort): any {
    const data = this.allData.slice();
    if (!sort.active || sort.direction === '') {
      this.allData = data;
      return;
    }

    this.allData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case Constants.colNames[9]: return this.compareStrings(a[Constants.colNames[9]], b[Constants.colNames[9]], isAsc);
        case Constants.colNames[13]: return this.compareNumbers(parseFloat(a[Constants.colNames[13]]),
          parseFloat(b[Constants.colNames[13]]), isAsc);
        case Constants.colNames[14]: return this.compareNumbers(parseFloat(a[Constants.colNames[14]]),
          parseFloat(b[Constants.colNames[14]]), isAsc);
        case Constants.colNames[15]: return this.compareNumbers(parseFloat(a[Constants.colNames[15]]),
          parseFloat(b[Constants.colNames[15]]), isAsc);
        case Constants.colNames[16]: return this.compareNumbers(parseFloat(a[Constants.colNames[16]]),
          parseFloat(b[Constants.colNames[16]]), isAsc);
        case Constants.colNames[17]: return this.compareNumbers(parseFloat(a[Constants.colNames[17]]),
          parseFloat(b[Constants.colNames[17]]), isAsc);
        case Constants.colNames[18]: return this.compareNumbers(parseFloat(a[Constants.colNames[18]]),
          parseFloat(b[Constants.colNames[18]]), isAsc);
        default: return 0;
      }
    });
    this.dataSource = new MatTableDataSource(this.allData);

  }

  compareNumbers(a: number, b: number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  compareStrings(a: string, b: string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
