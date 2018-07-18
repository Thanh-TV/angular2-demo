import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  users:any = [];
  groups:any = [];
  deletingUserObject:any;
  deletingType:any;
  deletingUserObjectIndex:any;
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
  newUser:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.users = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/User').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
          $.each(self.users, function(idx, user){
            self.prepareUserValues(user);
          });
        }
        self.isLoading = false;
      });
      self._baseService.getBase('api/Group').then((res:any) => {
        if (res && res.ok != false) {
          self.groups = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  prepareUserValues(user, type:any = undefined) {
    var self = this;

    if (user.ExpiresOn) {
      user.ExpiresOn = window.getDateInputFormat(user.ExpiresOn);
    }
    if (user.LastTokenRequest) {
      user.LastTokenRequest = window.getDateInputFormat(user.LastTokenRequest);
    }
    if (user.LastLogin) {
      user.LastLogin = window.getDateInputFormat(user.LastLogin);
    }
  }

  btnRemoveUserClick(user, index) {
    this.deletingUserObject = user;
    this.deletingUserObjectIndex = index;
    this.deletingType = 'user';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    var url:any = 'api/user/' + self.deletingUserObject.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.users.splice(self.deletingUserObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddUserClick() {
    this.initNewUser();
    $("#modalAddUser").modal('show');
  }

  initNewUser() {
    this.newUser = {
      UserName: '',
      ScreenName: '',
      EmailAddress: '',
      Role: 'User'
    };
  }

  btnSaveUserClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddUser");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/user', self.newUser).then((res:any) => {
      if (res && res.Soid) {
        self.prepareUserValues(res);
        self.users.push(res);
        $("#modalAddUser").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['IsNew', 'Reset'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/user/' + editingObject.Soid;
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
        var dateInputs:any = ['ExpiresOn', 'LastTokenRequest', 'LastLogin'];
        if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
