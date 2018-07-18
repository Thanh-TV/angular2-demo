import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-component',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };
  constructor(){}

  ngOnInit(){
  }
}
