import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;

@Component({
  selector: 'forgot-password-component',
  templateUrl: './forgot-password.component.html',
  providers: [BaseService]
})

export class ForgotPasswordComponent implements OnInit {
  errorMessage:any = '';
  email:any = '';
  isSuccess:any = false;
  headerConfig:any = {
    menuLeft: false,
    loggedIn: false
  };

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
  }

  btnSubmitClick(event) {
    var self = this;
    if (self.email.trim() == '') {
      self.errorMessage = 'Please enter your email.';
      return;
    }

    if (!self.validateEmail(self.email.trim())) {
      self.errorMessage = 'Email is invalid.';
      return;
    }
    var data = { EmailAddress: self.email.trim() };

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }

    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Credentials/PasswordRecovery', data, true).then((res:any)=>{
      if (!res) {
        self.isSuccess = true;
      } else {
        self.isSuccess = false;
        self.errorMessage = 'Email not found.';
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  txtEmailKeyUp() {
    if ((this.email.trim() != '' && this.errorMessage == 'Please enter your email.') || (this.errorMessage == 'Email is invalid.' && this.validateEmail(this.email.trim())) || this.errorMessage  == 'Email not found.') {
      this.errorMessage = '';
    }
    this.isSuccess = false;
  }
}
