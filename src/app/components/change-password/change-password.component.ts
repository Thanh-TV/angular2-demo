import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'change-password-component',
  templateUrl: './change-password.component.html',
  providers: [BaseService]
})

export class ChangePasswordComponent implements OnInit {
  errorMessage:any = '';
  password:any = '';
  confirmPassword:any = '';
  userInfo:any;
  isSuccess:any = false;
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
    var self = this;
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo){
      self.userInfo = JSON.parse(userInfo);
    } else {
      self._router.navigate(['/login']);
    }
  }

  btnSubmitClick(event) {
    var self = this;
    if (self.password.trim() == '' || self.confirmPassword.trim() == '') {
      self.errorMessage = 'Please enter your password.';
      return;
    }
    if (self.password != self.confirmPassword) {
      self.errorMessage = 'Passwords do not match.';
      return;
    }

    if (self.errorMessage)
      return;

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var data = {
      UserSoid: self.userInfo.userInfo.UserSoid,
      Password: self.password.trim()
    }
    self._baseService.patchBase('api/Credentials/' + self.userInfo.userInfo.UserSoid + '/ChangePassword', data).then((res:any)=>{
      if (res && res.ok == false) {
        self.errorMessage = 'An error occurred. Please try again.';
        return;
      }
      self.isSuccess = true;
      setTimeout(function(){
        self._router.navigate(['/login']);
      }, 2000);
      $(event.target).removeClass('btn-loading');
    });
  }

  txtPasswordKeyUp() {
    if (this.password == this.confirmPassword) {
      this.errorMessage = '';
    }
  }
}
