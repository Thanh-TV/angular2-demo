import { Component, OnInit } from '@angular/core';
import { BaseService} from '../../services/base.service';

declare var window:any;
declare var $:any;

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  providers: [BaseService]
})

export class RegisterComponent implements OnInit {
  headerConfig:any = {
    menuLeft: false,
    loggedIn: false
  };
  errorMessage:any = '';
  email:any = '';
  firstName:any = '';
  lastName:any = '';
  isSuccess:any = false;

  constructor(private _baseService: BaseService){}

  ngOnInit(){
    var self = this;
    //$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
    //  if (data && data.geobytesremoteip) {
     //   self.localIp = data.geobytesremoteip;
     // }
    //});
  }

  btnSubmitClick(event) {
    var self = this;
    if (self.email.trim() == '') {
      self.errorMessage = 'Please enter your email.';
      return;
    } else if (self.firstName.trim() == '') {
      self.errorMessage = 'Please enter your first name.';
      return;
    } else if (self.lastName.trim() == '') {
      self.errorMessage = 'Please enter your last name.';
      return;
    }

    if (!self.validateEmail(self.email.trim())) {
      self.errorMessage = 'Email is invalid.';
      return;
    }

    var data = {
      EmailAddress: self.email.trim(),
      Realm: 'World',
      Role: 'User',
      NameFirst: self.firstName.trim(),
      NameLast: self.lastName.trim()
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/User/Registration', data).then((res:any)=>{
      if (res && res.ok == false) {
        self.errorMessage = 'This email is already used.';
        self.isSuccess = false;
      } else {
        self.isSuccess = true;
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  txtEmailKeyUp() {
    if ((this.email.trim() != '' && this.errorMessage == 'Please enter your email.') ||
    (this.errorMessage == 'Email is invalid.' && this.validateEmail(this.email.trim())) ||
    this.errorMessage == 'This email is already used.') {
      this.errorMessage = '';
    }

    this.isSuccess = false;
  }

  txtFirstNameKeyUp() {
    if (this.errorMessage == 'Please enter your first name.') {
      this.errorMessage = '';
    }
    this.isSuccess = false;
  }

  txtLastNameKeyUp() {
    if (this.errorMessage == 'Please enter your last name.') {
      this.errorMessage = '';
    }
    this.isSuccess = false;
  }
}
