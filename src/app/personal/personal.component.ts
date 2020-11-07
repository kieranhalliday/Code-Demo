import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Constants } from '../constants';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  allRows = [];
  allData = [];
  patient;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.readFile(Constants.fileName);
  }

  readFile(url: string): void {
    // Reset all counters

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
            } else {
              // Remove blank rows
              // These rows are just carriage returns
              this.allRows.splice(this.allRows.indexOf(r), 1);
            }
          });
        });
        this.patient = this.allData[0];
      });
  }

}
