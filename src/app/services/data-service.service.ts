import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { DateWiseData } from '../models/date-wise-data';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  month;
  year;
  date;
  // globalDataUrl1;
  getDate(date: number) {
    if (date < 10) {
      return '0' + date;
    }
    return date;
  }
  private newUrl;
  private globalDataUrl1 = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-17-2020.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
  private extention = `.csv`;
  constructor(private http: HttpClient) {

    let full_date = new Date();
    this.year = full_date.getFullYear();
    this.month = new Date().getMonth() + 1;
    this.date = new Date().getDate();
    // this.globalDataUrl1 = `${this.globalDataUrl}${this.getDate(this.month)}-${this.getDate(this.date - 1)}-${this.year}${this.extention}`;
    // console.log(this.globalDataUrl1, "first");

  }

  getDateWiseData() {
    return this.http.get(this.dateWiseDataUrl, { responseType: 'text' })
      .pipe(map(result => {
        let rows = result.split('\n');
        // console.log(rows);
        let mainData = {};
        rows.splice(0, 1);

        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);

        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let con = cols[1];
          cols.splice(0, 4);
          // let start = (cols.length - 30);
          // let end = cols.length;
          // if (start > 0) {

          //   console.log(start, end);
          //   for (let i:number = start, i:number <= end; i++){

          //   }

          // }

          mainData[con] = [];
          cols.forEach((value, index) => {
            let dw: DateWiseData = {
              cases: +value,
              country: con,
              date: new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw)
          })

        })
        // console.log(mainData['India'], "llllllll");

        return mainData;
      }))
  }



  getGlobalData() {
    return this.http.get(this.globalDataUrl1, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice(0, 1)
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          }

          let temp: GlobalDataSummary = raw[cs.country];
          if (temp) {
            temp.active += cs.active
            temp.confirmed += cs.confirmed
            temp.deaths += cs.deaths
            temp.recovered += cs.recovered

            raw[cs.country] = temp;
          } else {
            raw[cs.country] = cs;
          }

        })

        return <GlobalDataSummary[]>Object.values(raw)
      }),
      // catchError((error: HttpErrorResponse) => {
      //   if (error.status == 404) {
      //     this.date = this.date - 1;
      //     this.newUrl = `${this.globalDataUrl}${this.getDate(this.month)}-${this.getDate(this.date - 1)}-${this.year}${this.extention}`;
      //     // console.log(this.newUrl);
      //     // return false
      //     return this.getGlobalData();
      //   }
      // })
    )
  }
}
