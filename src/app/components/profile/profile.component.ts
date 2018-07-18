import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html',
  providers: [BaseService],
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  errorMessage:any = '';
  isLoading:any = false;
  user:any = {
    Addresses: [],
    Assets: [],
    Documents: [],
    EmailAddresses: [],
    Employments: [],
    PhoneNumbers: [],
    Shops: []
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
  userInfo:any;
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
    var self = this;
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Person/' + self.userInfo.userInfo.UserSoid).then((res:any) => {
        if (res && res.Soid) {
          self.user = res;
          self.prepareUserValues();
        }
        self.isLoading = false;
      });
    } else {
      debugger;
      self._router.navigate(['/login']);
    }
  }

  prepareUserValues(type:any = null) {
    var self = this;
    if (!type) {
      self.user.DateOfBirth = window.getDateInputFormat(self.user.DateOfBirth);
      self.user.DLExpirationDate = window.getDateInputFormat(self.user.DLExpirationDate);
      self.user.DLStartDate = window.getDateInputFormat(self.user.DLStartDate);
    }
    if ((!type || type == 'accidents') && self.user.Accidents) {
      $.each(self.user.Accidents, function(idx, accident){
        accident.AccidentDate = window.getDateInputFormat(accident.AccidentDate);
      });
    }
    //if ((!type || type == 'ticket') || self.user.Tickets) {
    //  $.each(self.user.Tickets, function(idx, ticket){
    //    ticket.TicketDate = window.getDateInputFormat(ticket.TicketDate);
    //  });
    //}
    //if ((!type || type == 'violation') || self.user.Violations) {
    //  $.each(self.user.Violations, function(idx, violation){
    //    violation.ViolationDate = window.getDateInputFormat(violation.ViolationDate);
    //  });
    //}
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

  btnSubmitClick() {
    var self = this;
    if (self.user.email.trim() == '' || self.user.screenName.trim() == '') {
      self.errorMessage = 'Please enter the require fields (*).';
      return;
    }
    self._baseService.getBase('').then((res:any)=>{
      window.showSuccess('Saved!');
    });
  }

  btnChangePasswordClick() {
    this._router.navigate(['/reset-password']);
  }

  btnAddAddressClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonAddress', {}).then((res:any) => {
      if (res && res.Addresses) {
        self.handleAfterSaving(self.user.Addresses, res.Addresses);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddEmailAddressClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonEmailAddress', {}).then((res:any) => {
      if (res && res.EmailAddresses) {
        self.handleAfterSaving(self.user.EmailAddresses, res.EmailAddresses);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddDocumentClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonDocument', {}).then((res:any) => {
      if (res && res.Documents) {
        self.handleAfterSaving(self.user.Documents, res.Documents);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddPhoneNumberClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonPhoneNumber', {}).then((res:any) => {
      if (res && res.PhoneNumbers) {
        self.handleAfterSaving(self.user.PhoneNumbers, res.PhoneNumbers);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddEmployeeClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/Employee', {}).then((res:any) => {
      if (res && res.Employees) {
        self.handleAfterSaving(self.user.Employees, res.Employees);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddAssetClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonAsset', {}).then((res:any) => {
      if (res && res.Assets) {
        self.handleAfterSaving(self.user.Assets, res.Assets);
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddAccidentClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonAccident', {}).then((res:any) => {
      if (res && res.Accidents) {
        self.handleAfterSaving(self.user.Accidents, res.Accidents);
        self.prepareUserValues('accident');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddTicketClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonTicket', {}).then((res:any) => {
      if (res && res.Tickets) {
        self.handleAfterSaving(self.user.Tickets, res.Tickets);
        self.prepareUserValues('ticket');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddViolationClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Person/' + self.user.Soid + '/AddPersonViolation', {}).then((res:any) => {
      if (res && res.Violations) {
        self.handleAfterSaving(self.user.Violations, res.Violations);
        self.prepareUserValues('violation');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnDeleteClick(address, type, index) {
    this.deletingObject = address;
    this.deletingObjectIndex = index;
    this.deletingType = type;
    $("#confirmation_modal").modal('show');
  }

  handleAfterDeleting(event) {
    $(event.target).removeClass('btn-loading');
    $("#confirmation_modal").modal('hide');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    if (self.deletingType == 'address') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonAddress/' + self.deletingObject.Soid).then((res)=>{
        self.user.Addresses.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'emailAddress') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonEmailAddress/' + self.deletingObject.Soid).then((res)=>{
        self.user.EmailAddresses.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'phoneNumber') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonPhoneNumber/' + self.deletingObject.Soid).then((res)=>{
        self.user.PhoneNumbers.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'document') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonDocument/' + self.deletingObject.Soid).then((res)=>{
        self.user.Documents.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'employee') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeleteEmployee/' + self.deletingObject.Soid).then((res)=>{
        self.user.Employees.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'asset') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonAsset/' + self.deletingObject.Soid).then((res)=>{
        self.user.Assets.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'accident') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonAccident/' + self.deletingObject.Soid).then((res)=>{
        self.user.Accidents.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'ticket') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonTicket/' + self.deletingObject.Soid).then((res)=>{
        self.user.Tickets.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    } else if (self.deletingType == 'violation') {
      self._baseService.deleteBase('api/Person/' + self.user.Soid + '/DeletePersonViolation/' + self.deletingObject.Soid).then((res)=>{
        self.user.Violations.splice(self.deletingObjectIndex, 1);
        self.handleAfterDeleting(event);
      });
    }
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  txtValueChange(event, type, fieldName, editingObject) {
    var self = this;
    var value:any = '';
    if (fieldName == 'Main' || fieldName == 'Own' || fieldName == 'AtFault') {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };
    var url = 'api/Person/' + self.user.Soid;
    if (type == 'address') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonAddress/' + editingObject.Soid;
    } else if (type == 'email') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonEmailAddress/' + editingObject.Soid;
    } else if (type == 'phone') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonPhoneNumber/' + editingObject.Soid;
    } else if (type == 'document') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonDocument/' + editingObject.Soid;
    } else if (type == 'employee') {
      url = 'api/Person/' + self.user.Soid + '/UpdateEmployee/' + editingObject.Soid;
    } else if (type == 'asset') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonAsset/' + editingObject.Soid;
    } else if (type == 'accident') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonAccident/' + editingObject.Soid;
    } else if (type == 'ticket') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonTicket/' + editingObject.Soid;
    } else if (type == 'violation') {
      url = 'api/Person/' + self.user.Soid + '/UpdatePersonViolation/' + editingObject.Soid;
    }
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (fieldName == 'Main' || fieldName == 'Own' || fieldName == 'AtFault') {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
      } else {
        if (!res.Value)
          res.Value = '';
        var dateFields = ['ViolationDate', 'AccidentDate', 'TicketDate'];
        if (dateFields.indexOf(fieldName) >= 0  && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
      if (type == 'phone' && fieldName == 'Number') {
        if (!res.Data)
          res.Data = '';
        setTimeout(function(){
          $(event.target).closest('div.person-phone-number-ctn').find('.sub-accordion').text(res.Data);
        }, 100);
      }
    });
  }
}
