import { Component, OnInit } from "@angular/core";
import { GlobalDataSummary } from "src/app/models/global-data";
import { DataServiceService } from "src/app/services/data-service.service";
import { GoogleChartInterface } from "ng2-google-charts";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  datatable = [];
  globalData: GlobalDataSummary[];
  chart = {
    PieChart: "PieChart",
    ColumnChart: 'ColumnChart',
    LineChart: "LineChart",
    height: 500,
    options: {
      animation: {
        duration: 1000,
        easing: 'out',
      },
      is3D: true
    }
  }

  // pieChart: GoogleChartInterface = {
  //   chartType: "PieChart",
  // };
  // columnChart: GoogleChartInterface = {
  //   chartType: "ColumnChart",
  // };
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        // console.log(result);
        this.globalData = result;
        result.forEach((cs) => {
          if (!Number.isNaN(cs.confirmed)) {
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        });

        this.initChart('c');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  initChart(caseType: string) {
    // console.log("called");    
    this.datatable = [];
    // datatable.push(["Country", "Cases"]);

    this.globalData.forEach((cs) => {
      let value: number = 0;
      if (caseType == "c") {
        if (cs.confirmed > 2000) {
          value = cs.confirmed;
        }
      }
      if (caseType == "a") {
        if (cs.active > 2000) {
          value = cs.active;      
        }
      }
      if (caseType == "r") {
        if (cs.recovered > 2000) {
          value = cs.recovered;
        }
      }
      if (caseType == "d") {
        if (cs.deaths > 2000) {
          value = cs.deaths;
        }
      }
      this.datatable.push([cs.country, value]);
    });

    // this.pieChart = {
    //   chartType: "PieChart",
    //   dataTable: this.datatable,
    //   //firstRowIsData: true,
    //   options: { height: 500 },
    // };
    // this.columnChart = {
    //   chartType: "ColumnChart",
    //   dataTable: this.datatable,
    //   //firstRowIsData: true,
    //   options: { height: 500 },
    // };
  }

  updateChart(input: HTMLInputElement) {
    // console.log(input.value);
    this.initChart(input.value);
  }

  
}
