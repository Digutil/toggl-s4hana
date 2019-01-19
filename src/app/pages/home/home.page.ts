import { Component, OnInit } from '@angular/core';
import { TogglService } from 'src/app/services/toggl.service';
import * as moment from "moment";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  workspaceId;
  objectKeys = Object.keys;
  entries = {};
  projectMappings;
  accumulatedReportData = [];
  accumulatedReportDataCallCount = 1;

  constructor(private togglService: TogglService) {
    this.projectMappings = JSON.parse(localStorage.getItem('togglProjects'))
  }

  ngOnInit() {
    this.workspaceId = localStorage.getItem('togglWorkspace');
    this.getAllReportEntries();
  }

  getAllReportEntries(callCount=1) {
    this.togglService.getWeeklyReportDetails(this.workspaceId, callCount).subscribe((report: any) => {
      report.data.forEach((entryData: any) => {
        this.accumulatedReportData.push(entryData);
      });
      if((this.accumulatedReportDataCallCount * 50) < report.total_count) {
        this.accumulatedReportDataCallCount++;
        this.getAllReportEntries(this.accumulatedReportDataCallCount);
      } else {
        this.processReportData();
      }
    });
  }

  processReportData() {
    this.accumulatedReportData.forEach(entry => {
      let start = moment(entry.start).set({hour:0,minute:0,second:0,millisecond:0}).format('YYYY-MM-DD');
      if(!this.entries.hasOwnProperty(start)) {
        this.entries[start] = {};
      }
      if(!this.entries[start].hasOwnProperty(entry.pid)) {
        this.entries[start][entry.pid] = {
          descriptions: [],
          duration: 0
        };
      }
      if(this.entries[start][entry.pid]['descriptions'].indexOf(entry.description) == -1) {
        this.entries[start][entry.pid]['descriptions'].push(entry.description);
      }
      this.entries[start][entry.pid]['duration'] += entry.dur;
    });
  }

  copyDescription(id) {
    var copyText: any = document.getElementById(id);
    copyText.select();
    document.execCommand("copy");
  }

  mapProject(projectId) {
    return this.projectMappings[projectId];
  }

  timeConversion(duration: any) {
    let minutes: any = ((duration / (1000 * 60)) % 60).toFixed(0);
    let hours: any = Math.floor((duration / (1000 * 60 * 60)) % 24).toFixed(0);
    minutes = Math.round(((minutes < 10) ? "0" + minutes : minutes) / 10) * 10;
    if(minutes === 60){
      return (parseInt(hours) + 1) + ":00";
    } else {
      return hours + ":" + minutes;
    }

  }

}
