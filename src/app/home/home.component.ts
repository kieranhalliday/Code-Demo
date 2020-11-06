import { Component, OnInit } from '@angular/core';
import { Constants } from '../constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.readFile('../../assets/aging-report-2.txt');
  }

  readFile(url: string): void {
    let allRows = [];
    this.http.get(url, { responseType: 'text' })
      .subscribe(data => {
        allRows = data.toString().split('\n');

        // ignore first 3 rows because they are meta data
        allRows.splice(0, 3);

        const allData = {};

        allRows.forEach((row, outerIndex) => {
          const r = row.split('\t');
          r.forEach((value, index) => {
            // If the row is an empty row, ignore it
            if (!row) {
              return;
            }
            if (!allData[outerIndex]) {
              allData[outerIndex] = {};
            }
            allData[outerIndex][Constants.colNames[index]] = value;
          });
        });

        console.log(allData);
      });
  }

}
