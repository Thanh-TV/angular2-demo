import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'financial-register-component',
  templateUrl: './financial-register.component.html',
  styleUrls: ['./financial-register.component.css', '../../../share/css/base-panel.scss'],
  providers: [BaseService]
})

export class FinancialRegisterComponent implements OnInit {
  isLoading:any = false;
  registers:any = [];
  ledgers:any = [];
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };
  deletingObject:any;
  deletingType:any;
  deletingObjectIndex:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  officeId:any = '5b1b1505a21c1906e494da35';
  modalFinancialRegisterType:any = "opening";

  constructor(private _baseService: BaseService){}

  ngOnInit(){
    var self = this;
    self.isLoading = true;
    self.loadData();
    self._baseService.getBase('api/Ledger').then((res:any) => {
      self.ledgers = res;
    });
    window.initScrollBar();
  }

  loadData() {
    var self = this;
    var url:any = 'api/EndOfDay/' + self.officeId + '/DailyReports';
    self._baseService.getBase(url).then((res:any) => {
      self.isLoading = false;
      self.registers = res;
    });
  }

  btnDeleteClick(deletingObject, deletingType, index) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingType = deletingType;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');

  }

  btnSaveOpeningClosingClick(response) {
    var self = this;
    var event:any = response.event;
    var data:any = response.data;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var url:any = 'api/EndOfDay/' + self.officeId + '/Opening';
    $(event.target).addClass('btn-loading');
    self._baseService.postBase(url, data).then((result)=>{
      if (result && result.ok == false) {
        window.showError();
      } else {
        self.loadData();
        $("#modalFinancialRegister").modal('hide');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnOpeningClosingClick(type) {
    this.modalFinancialRegisterType = type;
    $("#modalFinancialRegister").modal('show');
  }

  btnViewMoreClick(event, register) {
    var self = this;
    if (!register.details) {
      $(event.target).addClass('btn-loading');
      var url:any = 'api/EndOfDay/' + register.Soid;
      self._baseService.getBase(url).then((res:any) => {
        register.details = res;
        register.isShowMore = true;
        $(event.target).removeClass('btn-loading');
      });
    } else {
      register.isShowMore = true;
    }
  }
}
