import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare var $:any;
declare var window:any;

@Component({
  selector: 'left-menu-component',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})

export class LeftMenuComponent implements OnInit {
  currentPage:any = '';

  constructor(private _router: Router){
    var self = this;
    self._router.events.subscribe((event: any) => {
      self.currentPage = event.url.replace('/', '');
    });
  }

  ngOnInit(){
    window.initScrollBar();
  }

  redirectTo(page) {
    $("#leftMenuModal").modal('hide');
    this._router.navigate(['/' + page]);
  }
}
