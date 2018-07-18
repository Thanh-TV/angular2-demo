import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'company-component',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss', '../share/css/base-panel.scss']
})

export class CompanyComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  companies:any = [];
  users:any = [];
  deletingObject:any;
  deletingType:any;
  deletingObjectIndex:any;
  deletingParentObject:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };
  newCompany:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.companies = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Company').then((res:any) => {
        if (res && res.ok != false) {
          self.companies = res;
          $.each(self.companies, function(idx, company){
            self.prepareCompanyValues(company);
          });
        }
        self.isLoading = false;
        self.initScrollBar();
      });
      self._baseService.getBase('api/Person').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  prepareCompanyValues (company, type:any = undefined) {
    var self = this;

    if (!type) {
      company.BusinessStartDate = window.getDateInputFormat(company.BusinessStartDate);
    }

    if ((!type || type=='asset') && company.Assets) {
      $.each(company.Assets, function(idx2, asset){
        if (asset.PurchasedOn) {
          asset.PurchasedOn = window.getDateInputFormat(asset.PurchasedOn);
        }
      });
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  handleAfterSaving(oldData, newData) {
    var deletedIndexes:any = [];
    for (var i = 0; i < oldData.length; i++) {
      var existedIndex = -1;
      for (var j =0; j < newData.length; j++) {
        if (oldData[i].Soid == newData[j].Soid) {
          existedIndex = j;
          break;
        }
      }
      if (existedIndex >= 0) {
        newData.splice(existedIndex, 1);
      } else {
        deletedIndexes.push(i);
      }
    }

    if (newData && newData.length > 0) {
      $.each(newData, function(index, item){
        oldData.push(item);
      });
    }

    if (deletedIndexes && deletedIndexes.length > 0) {
      for (var t = deletedIndexes.length - 1; t >= 0; t--) {
        oldData.splice(deletedIndexes[t], 1);
      }
    }
  }

  btnDeleteClick(deletingObject, deletingType, index, deletingParentObject) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingType = deletingType;
    this.deletingParentObject = deletingParentObject;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "";
    if (self.deletingType == 'asset') {
      url = 'api/Company/' + self.deletingParentObject.Soid + '/DeleteCompanyAsset/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'company') {
      url = 'api/Company/' + self.deletingObject.Soid;
    }

    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'asset') {
        self.handleAfterSaving(self.companies[self.deletingObjectIndex].Assets, res.Assets);
        self.prepareCompanyValues(self.companies[self.deletingObjectIndex], 'asset');
      } else if (self.deletingType == 'company') {
        self.companies.splice(self.deletingObjectIndex, 1);
      }
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddCompanyClick() {
    this.initNewCompany();
    $("#modalAddCompany").modal('show');
  }

  initNewCompany() {
    this.newCompany = {
      CompanyName: '',
      PhoneNumber: '',
      Region: ''
    };
  }

  btnSaveCompanyClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddCompany");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Company';
    self._baseService.postBase(url, self.newCompany).then((res:any) => {
      if (res && res.Soid) {
        self.companies.push(res);
        self.prepareCompanyValues(self.companies[self.companies.length - 1]);
        self.initScrollBar();
        $("#modalAddCompany").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddCompanyAssetClick(event, company) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Company/' + company.Soid + '/AddCompanyAsset';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(company.Assets, res.Assets);
        self.prepareCompanyValues(company, 'asset');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Own', 'Verified'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    if (fieldName.indexOf('.') >= 0) {
      data.FieldName = fieldName.split('.')[0];
      data.Data = editingObject[data.FieldName];
      data.Data[fieldName.split('.')[1]] = value;
    }

    var url;
    if (type == 'company') {
      url = 'api/Company/' + editingObject.Soid;
    } else if (type == 'asset') {
      url = 'api/Company/' + parentObject.Soid + '/UpdateCompanyAsset/' + editingObject.Soid;
    }
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

        var dateFieldNames = ['BusinessStartDate', 'PurchasedOn'];
        if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
