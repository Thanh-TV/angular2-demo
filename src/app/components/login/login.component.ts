import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var sessionStorage:any;
declare var JSON:any;

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  providers: [BaseService]
})

export class LoginComponent implements OnInit {
  errorMessage:any = '';
  email:any = '';
  password:any = '';
  headerConfig:any = {
    menuLeft: false,
    loggedIn: false
  };

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
  }

  btnSubmitClick(event) {
    var self = this;
    if (self.email.trim() == '' || self.password.trim() == '') {
      self.errorMessage = 'Please enter your email and password.';
      return;
    }
    var loginData = {
      UserName: self.email.trim(),
      Password: self.password.trim()
    };
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Credentials/Login', loginData, true).then((res:any)=>{
      if (res && res.LoginSoid) {
        var userInfo = {
          setAt: new Date(),
          userInfo: res
        };
        sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
        self._baseService.patchBase('api/Credentials/' + res.LoginSoid + '/TrackLogin', {}).then((res)=>{
        });
        self._router.navigate(['/dashboard']);
      } else {
        self.errorMessage = 'Invalid log in or server error. Please try again';
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtLoginKeyUp() {
    if (this.email.trim() != '' && this.password.trim() != '') {
      this.errorMessage = '';
    }
  }

  btnForgotPasswordClick() {
    this._router.navigate(['/forgot-password']);
  }
}
