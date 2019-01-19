import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TogglService } from 'src/app/services/toggl.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  apiToken: string = '';
  workspaces;
  selectedWorkspace;

  constructor(private router: Router, private togglService: TogglService) {
    this.apiToken = localStorage.getItem('togglApiToken');
    this.selectedWorkspace = localStorage.getItem('togglWorkspace');
    if(this.apiToken) {
      this.getWorkSpaces();
    }
  }

  ngOnInit() {
  }

  fetchWorkspaces() {
    localStorage.setItem('togglApiToken', this.apiToken);
    this.getWorkSpaces();
  }

  getWorkSpaces() {
    this.togglService.authenticate().subscribe((me: any) => {
      this.workspaces = me.data.workspaces;
    });
  }

  continue() {
    localStorage.setItem('togglWorkspace', this.selectedWorkspace);
    this.togglService.getProjects(this.selectedWorkspace).subscribe((projects: any) => {
      let selectedProjects: any = {};
      projects.forEach((project: any) => {
        selectedProjects[project.id] = project.name;
      });
      localStorage.setItem('togglProjects', JSON.stringify(selectedProjects));
      this.router.navigate(['/home']);
    });
  }

}
