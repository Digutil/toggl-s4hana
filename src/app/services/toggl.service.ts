import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class TogglService {

  apiToken: string = '';
  togglWeeklyReportUrl: string = 'https://toggl.com/reports/api/v2/details';
  togglProjectsUrl: string = 'https://www.toggl.com/api/v8/projects/';
  togglWorkspacesUrl: string = 'https://www.toggl.com/api/v8/workspaces';
  togglAuthUrl: string = 'https://www.toggl.com/api/v8/me';

  httpOptions;

  constructor(private http: HttpClient) {
    this.apiToken = localStorage.getItem('togglApiToken');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(this.apiToken + ':' + 'api_token')
      })
    };
  }

  authenticate() {
    return this.http.get(this.togglAuthUrl, this.httpOptions);
  }

  getProjects(workspaceId) {
    let url = 'https://www.toggl.com/api/v8/workspaces/'+workspaceId+'/projects';
    return this.http.get(url, this.httpOptions);
  }

  getWeeklyReportDetails(workspace_id, page=1) {
    let since = moment().startOf('month').format('YYYY-MM-DD');
    let until = moment().endOf('month').format('YYYY-MM-DD');
    let parameters = '?workspace_id='+workspace_id+'&page='+page+'&user_agent=toggls4hana&since='+since+'&until='+until;
    return this.http.get(this.togglWeeklyReportUrl + parameters, this.httpOptions);
  }

  getProject(projectId) {
    return this.http.get(this.togglProjectsUrl + projectId, this.httpOptions);
  }
}
