import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'office-component',
  templateUrl: './office.component.html',
  styleUrls: ['./office.component.scss', '../../share/css/base-comment.scss']
})

export class OfficeComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  offices:any = [];
  users:any = [];
  modules:any = [];
  deletingObject:any;
  deletingType:any;
  deletingObjectIndex:any;
  deletingParentObject:any;
  deletingSubParentObject:any;
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
  notifyingObject:any;
  notifyUser:any = "";
  newAppointment:any = {Participants: []};
  totalNewParticipants:number = 0;
  totalAddedNewParticipants:number = 0;
  newEmployee:any = {};
  currentOffice:any;
  pageSize:number = 20;
  newOffice:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.offices = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Office').then((res:any) => {
        if (res && res.ok != false) {
          self.offices = res;
          $.each(self.offices, function(idx, office){
            self.prepareOfficeValues(office);
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
      self._baseService.getBase('api/Module').then((res:any) => {
        if (res && res.ok != false) {
          self.modules = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  prepareOfficeValues (office, type:any = undefined) {
    var self = this;
    if ((!type || type=='employee') && office.Employees) {
      $.each(office.Employees, function(idx1, employee){
        if (employee.Start) {
          employee.Start = window.getDateInputFormat(employee.Start);
        }
        if (employee.End) {
          employee.End = window.getDateInputFormat(employee.End);
        }

        if (employee.DefaultClockIn) {
          employee.DefaultClockIn = window.getTimeInputFormat(employee.DefaultClockIn);
        }
        if (employee.DefaultClockOut) {
          employee.DefaultClockOut = window.getTimeInputFormat(employee.DefaultClockOut);
        }
      });
    }
    if ((!type || type=='module') && office.Modules) {
      $.each(office.Modules, function(idx2, module){
        if (module.Start) {
          module.Start = window.getTimeInputFormat(module.Start);
        }
        if (module.End) {
          module.End = window.getTimeInputFormat(module.End);
        }
      });
    }
    if ((!type || type=='customer') && office.Customers) {
      office.totalCustomers = office.Customers.length;
      office.totalCustomerPages = parseInt((office.totalCustomers / self.pageSize) + '');
      if (office.totalCustomers%self.pageSize != 0)
        office.totalCustomerPages += 1;
      office.pageNumbers = [];
      for (var i = 0; i < office.totalCustomerPages; i++) {
        office.pageNumbers.push(i+1);
      }
      office.maxCustomerPageIndex = parseInt((office.totalCustomerPages/5) + '');
      if (office.totalCustomerPages%5 != 0)
        office.maxCustomerPageIndex += 1;

      if (!type) {
        office.currentCustomerPage = 1;
        office.currentCustomerPageIndex = 1;
      }

      $.each(office.Customers, function(idx3, customer){

      });
    }

    if ((!type || type=='asset') && office.Assets) {
      $.each(office.Assets, function(idx2, asset){
        if (asset.PurchasedOn) {
          asset.PurchasedOn = window.getDateInputFormat(asset.PurchasedOn);
        }
      });
    }

    if ((!type || type=='priceList') && office.PriceLists) {
      $.each(office.PriceLists, function(idx3, priceList){
        if (priceList.StartDate) {
          priceList.StartDate = window.getDateInputFormat(priceList.StartDate);
        }
        if (priceList.EndDate) {
          priceList.EndDate = window.getDateInputFormat(priceList.EndDate);
        }
      });
    }

    if (!type) {
      setTimeout(function() {
        $("div.collapse").addClass('in');
      }, 500);
    }
  }

  btnPageMoreClick(office, type) {
    if (type == 0) {
      if (office.currentCustomerPageIndex > 1)
        office.currentCustomerPageIndex -= 1;
    } else {
      if (office.currentCustomerPageIndex < office.maxCustomerPageIndex)
        office.currentCustomerPageIndex += 1;
    }
  }

  btnNextPreviousClick(office, type) {
    if (type == 0) {
      if (office.currentCustomerPage > 1)
        office.currentCustomerPage -= 1;
    } else {
      if (office.currentCustomerPage < office.totalCustomerPages)
        office.currentCustomerPage += 1;
    }
  }

  btnDeleteClick(deletingObject, deletingType, index, deletingParentObject, deletingSubParentObject) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingType = deletingType;
    this.deletingParentObject = deletingParentObject;
    this.deletingSubParentObject = deletingSubParentObject;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "";
    if (self.deletingType == 'branch') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteBranch/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'employee') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteEmployee/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'module') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeModule/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'asset') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeAsset/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'customer') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeCustomer/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'priceList') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/DeletePriceList/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'priceListItem') {
      url = 'api/Office/' + self.deletingParentObject.Soid + '/PriceList/'+ self.deletingSubParentObject.Soid +'/DeletePriceListItem/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'office') {
      url = 'api/Office/' + self.deletingObject.Soid;
    }

    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'branch') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].Branches, res.Branches);
      } else if (self.deletingType == 'employee') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].Employees, res.Employees);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'employee');
      } else if (self.deletingType == 'module') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].Modules, res.Modules);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'module');
      } else if (self.deletingType == 'asset') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].Assets, res.Assets);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'asset');
      } else if (self.deletingType == 'customer') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].Customers, res.Customers);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'customer');
      } else if (self.deletingType == 'priceList') {
        self.handleAfterSaving(self.offices[self.deletingObjectIndex].PriceLists, res.PriceLists);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'priceList');
      } else if (self.deletingType == 'priceListItem') {
        var currentPriceList:any = res.PriceLists.filter(function(e){ return e.Soid == self.deletingSubParentObject.Soid });
        self.handleAfterSaving(self.deletingSubParentObject.Items, currentPriceList[0].Items);
        self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'priceList');
      } else if (self.deletingType == 'office') {
        self.offices.splice(self.deletingObjectIndex, 1);
      }
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
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

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddOfficeClick() {
    this.initNewOffice();
    $("#modalAddOffice").modal('show');
  }

  initNewOffice() {
    this.newOffice = {
      CompanyName: '',
      OfficeName: '',
      PhoneNumber: '',
      Region: ''
    };
  }

  btnSaveOfficeClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddOffice");
    if (invalid) {
      return;
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office';
    self._baseService.postBase(url, self.newOffice).then((res:any) => {
      if (res && res.Soid) {
        self.offices.push(res);
        self.prepareOfficeValues(self.offices[self.offices.length - 1]);
        $("#modalAddOffice").modal('hide');
        self.initScrollBar();
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddBranchClick(event, office) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + office.Soid + '/AddBranch';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(office.Branches, res.Branches);
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddModuleClick(event, office) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + office.Soid + '/AddOfficeModule';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(office.Modules, res.Modules);
        self.prepareOfficeValues(office, 'module');
        $("#modalAddEmployee").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddPriceListClick(event, office) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + office.Soid + '/AddPriceList';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(office.PriceLists, res.PriceLists);
        self.prepareOfficeValues(office, 'priceList');
        $("#modalAddEmployee").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddAssetClick(event, office) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + office.Soid + '/AddOfficeAsset';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(office.Assets, res.Assets);
        self.prepareOfficeValues(office, 'asset');
        $("#modalAddEmployee").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddPriceListItemClick(event, office, priceList) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + office.Soid + '/PriceList/' + priceList.Soid + '/AddPriceListItem';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        var currentPriceList:any = res.PriceLists.filter(function(e){ return e.Soid == priceList.Soid });
        self.handleAfterSaving(priceList.Items, currentPriceList[0].Items);
        self.prepareOfficeValues(office, 'priceList');
        $("#modalAddEmployee").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  initNewEmployee() {
    this.newEmployee = {
      PersonSoid: '',
      Position: '',
      Start: '',
      End: '',
      DefaultClockIn: '',
      DefaultClockOut: ''
    };
  }

  btnAddEmployeeClick(office) {
    this.initNewEmployee();
    this.currentOffice = office;
    $("#modalAddEmployee").modal('show');
  }

  btnSaveEmployeeClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddEmployee");
    if (invalid) {
      return;
    }

    var selectedPerson = self.users.filter(function(e){ return e.Soid == self.newEmployee.PersonSoid });
    if (selectedPerson && selectedPerson.length > 0) {
      self.newEmployee.PersonName = ((selectedPerson[0].NameFirst? selectedPerson[0].NameFirst: '') + ' ' + (selectedPerson[0].NameLast? selectedPerson[0].NameLast : '')).trim();
      if (selectedPerson[0].EmailAddresses && selectedPerson[0].EmailAddresses.length > 0) {
        for (var i = 0; i < selectedPerson[0].EmailAddresses.length; i++) {
          if (selectedPerson[0].EmailAddresses[i].Address) {
            self.newEmployee.EmailAddress = selectedPerson[0].EmailAddresses[i].Address;
            break;
          }
        }
      }
      if (selectedPerson[0].DLNumber)
        self.newEmployee.PhoneNumber = selectedPerson[0].DLNumber;
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Office/' + self.currentOffice.Soid + '/AddEmployee';
    self._baseService.postBase(url, self.newEmployee).then((res:any) => {
      if (res) {
        self.handleAfterSaving(self.currentOffice.Employees, res.Employees);
        self.prepareOfficeValues(self.currentOffice, 'employee');
        $("#modalAddEmployee").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}, parentSubObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Active', 'TimeStamping', 'TimeClockAdmin', 'ViewTraining', 'Global', 'PromptOnChange', 'GlobalSearch', 'GlobalReporting', 'Notifications'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url;
    if (type == 'office') {
      url = 'api/Office/' + editingObject.Soid;
    } else if (type == 'branch') {
      url = 'api/Office/' + parentObject.Soid + '/UpdateBranch/' + editingObject.Soid;
    } else if (type == 'employee') {
      url = 'api/Office/' + parentObject.Soid + '/UpdateEmployee/' + editingObject.Soid;
    } else if (type == 'module') {
      url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeModule/' + editingObject.Soid;
    } else if (type == 'asset') {
      url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeAsset/' + editingObject.Soid;
    } else if (type == 'customer') {
      url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeCustomer/' + editingObject.Soid;
    } else if (type == 'priceList') {
      url = 'api/Office/' + parentObject.Soid + '/UpdatePriceList/' + editingObject.Soid;
    } else if (type == 'priceListItem') {
      url = 'api/Office/' + parentObject.Soid + '/PriceList/' + parentSubObject.Soid + '/UpdatePriceListItem/' + editingObject.Soid;
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

        var dateFieldNames = ['Start', 'End', 'StartDate', 'EndDate', 'PurchasedOn'];
        if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
