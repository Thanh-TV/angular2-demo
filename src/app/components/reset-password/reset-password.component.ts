import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'reset-component',
  templateUrl: './reset-password.component.html',
  providers: [BaseService]
})

export class ResetPasswordComponent implements OnInit {
  headerConfig:any = {
    menuLeft: false,
    loggedIn: false
  };
  errorMessage:any = '';
  password:any = '';
  confirmPassword:any = '';
  token:any = "";
  isSuccess:any = false;

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
    var urlArr:any = window.location.href.split('?token=');
    if (urlArr.length == 1) {
      this.errorMessage = 'Token is required.';
    } else {
      this.token = urlArr[urlArr.length - 1];
      this.token = this.token.replace('%3D', '=');
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
    self._baseService.postBase('api/Credentials/Validate', {Token: self.token}, true).then((res:any)=>{
      if (res.ok != false && res.UserSoid) {
        var data:any = {UserSoid: res.UserSoid, Password: self.password.trim()};
        self._baseService.patchBase('api/Credentials/' + res.UserSoid + '/ChangePassword', data, true).then((res:any)=>{
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
      } else {
        $(event.target).removeClass('btn-loading');
        self.errorMessage = 'The token is expired.';
      }
    });
  }

  txtPasswordKeyUp() {
    if (this.password == this.confirmPassword) {
      this.errorMessage = '';
    }
  }
}
