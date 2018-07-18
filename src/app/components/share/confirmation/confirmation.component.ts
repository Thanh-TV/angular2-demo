import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'confirmation-component',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})

export class ConfirmationComponent implements OnInit {
  @Input() btnLeftText:any;
  @Input() btnRightText:any;
  @Input() title:any;
  @Input() content:any;
  @Input() confirmationType:any;
  @Output() handleBtnLeftClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() handleBtnRightClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(){}

  ngOnInit(){

  }

  btnLeftClick(event) {
    this.handleBtnLeftClick.emit(event);
  }

  btnRightClick(event) {
    this.handleBtnRightClick.emit(event);
  }
}
