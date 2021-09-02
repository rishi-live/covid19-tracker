import { Component, OnInit } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';
import { DateWiseData } from 'src/app/models/date-wise-data';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DataServiceService } from 'src/app/services/data-service.service';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  data: GlobalDataSummary[];
  countries: String[] = [];
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;

  selectedCountryData: DateWiseData[];
  dateWiseData: object;
  lineChart: GoogleChartInterface = {
    chartType: 'LineChart' 
  }
  constructor( private service: DataServiceService ) { }

  ngOnInit(): void {
    
    merge(
      this.service.getDateWiseData().pipe(
        map(result => {
          this.dateWiseData = result;
        })
      ),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        this.data.forEach(cs => {
          this.countries.push(cs.country)
        })
      }))
    ).subscribe(
      {
        complete: () => {
          this.updateValue('India')
          this.loading = false;
        }
      }
    )


    // this.service.getGlobalData().subscribe(result => {
    //   this.data = result;
    //   this.data.forEach(cs => {
    //     this.countries.push(cs.country);
    //   })
    // })
    // this.service.getDateWiseData().subscribe(result => {
    //   this.dateWiseData = result;
    //   // console.log(typeof(result));
      
    //   // this.updateChart()
    //   // console.log(result['Anhui']);
    //   // console.log(this.dateWiseData['Anhui']);
      
    // })
  }
  
  updateChart() {
    let dataTable = [];
    dataTable.push(["Date", 'Cases'])
    this.selectedCountryData.forEach(cs => {
      dataTable.push([cs.date, cs.cases])
    })

    this.lineChart = {
      chartType: "LineChart",
      dataTable: dataTable,
      //firstRowIsData: true,
      options: { height: 500 },
    };
  }


  updateValue( country: string ) {
    // console.log(country);
    this.data.forEach(cs => {
      if (cs.country == country) {
        this.totalConfirmed = cs.confirmed;
        this.totalActive = cs.active;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    })
    this.selectedCountryData = this.dateWiseData[country];
    // console.log(this.dateWiseData[country]);
    
    this.updateChart()
    // console.log(this.dateWiseData, country);
        
  }

}
