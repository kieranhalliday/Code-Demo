import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

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
    this.readFile('../../assets/aging-report-2.txt');
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

}
