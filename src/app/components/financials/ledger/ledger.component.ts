import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'financial-ledger-component',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css', '../../../share/css/base-panel.scss'],
  providers: [BaseService]
})

export class FinancialLedgerComponent implements OnInit {
  isLoading:any = false;
  ledgers:any = [];
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };
  deletingObject:any;
  deletingObjectIndex:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  officeId:any = '5b1b1505a21c1906e494da35';
  newLedger:any = {};

  constructor(private _baseService: BaseService){}

  ngOnInit(){
    var self = this;
    self.isLoading = true;
    self._baseService.getBase('api/Ledger').then((res:any) => {
      self.isLoading = false;
      self.ledgers = res;
    });
  }

  btnDeleteClick(deletingObject, index) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "api/Ledger/" + self.deletingObject.Soid;
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        $("#confirmation_modal").modal('hide');
        $(event.target).removeClass('btn-loading');
        return window.showError();
      }
      self.ledgers.splice(self.deletingObjectIndex, 1);
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  initNewLedger() {
    this.newLedger = {
      AccountName : "",
      AccountNumber : "",
      BankName : "",
      AgencyName : ""
    }
  }

  btnAddLedgerClick() {
    this.initNewLedger();
    $("#modalAddLedger").modal('show');
  }

  btnSaveLedgerClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddTicket");
    if (invalid) {
      return;
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "api/Ledger/";
    self._baseService.postBase(url, self.newLedger).then((res)=>{
      if (res && res.ok == false) {
        $("#modalAddLedger").modal('hide');
        $(event.target).removeClass('btn-loading');
        return window.showError();
      }
      self.ledgers.push(res);
      $("#modalAddLedger").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject) {
    var self = this;
    var value:any = '';
    var boolInputFields = [];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/Ledger/' + editingObject.Soid;
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (boolInputFields.indexOf(fieldName) >= 0) {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
      } else {
        if (!res.Value)
          res.Value = '';
        if (fieldName == 'DueOn' && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
