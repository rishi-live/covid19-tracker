import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  // full_date = new Date();
  // date = setDate();
  // month = new Date().getMonth() + 1;
  // year = new Date().getFullYear();
  private globalDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/04-17-2020.csv`;
  private dateWiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`
  
  constructor(private http: HttpClient) { }

  getGlobalData() {
    // console.log(this.date);
    
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {

        let data: GlobalDataSummary[] = [];
        let raw = {}
        let rows = result.split('\n');
        rows.splice( 0 ,1 )
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
        
        // console.log(raw);
        return <GlobalDataSummary[]> Object.values(raw)
      })
    )
  }
}
