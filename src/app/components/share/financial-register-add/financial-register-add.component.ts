import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

@Component({
  selector: 'financial-register-add-component',
  templateUrl: './financial-register-add.component.html',
  styleUrls: ['./financial-register-add.component.css', '../css/financial-base.scss'],
  providers: [BaseService]
})

export class FinancialRegisterAddComponent implements OnInit {
  @Input() type:any;
  @Input() ledgers:any;
  @Output() handleBtnSaveClick: EventEmitter<any> = new EventEmitter<any>();
  baseObject:any = {
    checks: [],
    credits: []
  };

  constructor(private _baseService: BaseService){}

  ngOnInit(){
    this.initBaseObject();
  }

  initBaseObject() {
    this.baseObject = {
      Bills001: "",
      Bills002: "",
      Bills005: "",
      Bills010: "",
      Bills020: "",
      Bills050: "",
      Bills100: "",
      Coins001: "",
      Coins005: "",
      Coins010: "",
      Coins025: "",
      Checks: [],
      Credits: []
    };
  }

  btnAddCheckCreditClick(type) {
    var addingObject = {
      Amount: '',
      Number: '',
      Owner: '',
      LedgerSoid: '',
      LedgerName: ''
    };
    if (type == 'check') {
      this.baseObject.Checks.push(addingObject);
    } else {
      this.baseObject.Credits.push(addingObject);
    }
  }

  btnSaveClick(event) {
    this.handleBtnSaveClick.emit({event: event, data: this.baseObject});
  }
}
