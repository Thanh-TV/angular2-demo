import { Component, OnInit, Input, OnChanges,  SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var window:any;
declare var UserInfo:any;
declare var $:any;

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [BaseService]
})

export class HeaderComponent implements OnInit {
  loggedInPage:any = false;
  menuLeft:any = false;
  isHomePage:any = false;
  timeOutSecs:number = 0;
  isShowingKeepLogoutModal:any = false;
  userInfo:any;
  userShortName:any = "";
  @Input() headerConfig:any;

  constructor(private _router: Router, private _baseService: BaseService){
    var self = this;
    self._router.events.subscribe((event: any) => {
      if (event.url == '/home' || event.url == '/') {
        self.isHomePage = true;
      } else {
        self.isHomePage = false;
      }
    });
  }

  ngOnInit(){
    var self = this;
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo){
      self.userInfo = JSON.parse(userInfo);
      if (self.userInfo.userInfo.ScreenName) {
        self.userShortName = self.userInfo.userInfo.ScreenName[0];
      } else if (self.userInfo.userInfo.UserName) {
        self.userShortName = self.userInfo.userInfo.UserName[0];
      }

    }
    setInterval(function(){
      var userInfo = sessionStorage.getItem('UserInfo');
      if (userInfo && self.loggedInPage) {
        if (!self.isShowingKeepLogoutModal) {
          self.userInfo = JSON.parse(userInfo);
          var setAt = new Date(self.userInfo.setAt);
          var dateNow = new Date();
          var timeDiff = Math.abs(dateNow.getTime() - setAt.getTime());
          var diffSeconds = Math.ceil(timeDiff / 1000);
          if (diffSeconds >= 600) {
            self.timeOutSecs = 600;
            self.isShowingKeepLogoutModal = true;
            $("#keepLogoutModal").modal({backdrop: 'static', keyboard: false});
            self.reduceTimeOutSecs();
          }
        }
      } else if (self.loggedInPage) {
        self._router.navigate(['/login']);
      }
    }, 5000);
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    var self = this;
    if (changes["headerConfig"] && changes["headerConfig"].currentValue != null) {
        var headerConfig = changes["headerConfig"].currentValue;
        self.loggedInPage = headerConfig.loggedIn;
        self.menuLeft = headerConfig.menuLeft;
    }
  }

  reduceTimeOutSecs() {
    var self = this;
    if (self.timeOutSecs > 0 && self.isShowingKeepLogoutModal) {
      self.timeOutSecs -= 1;
      if (self.timeOutSecs == 0) {
        sessionStorage.setItem('UserInfo', '');
        $("#keepLogoutModal").modal('hide');
        self.logout();
        debugger;
        self._router.navigate(['/login']);
      } else {
        setTimeout(function(){
          self.reduceTimeOutSecs();
        }, 1000);
      }
    }
  }

  btnKeepSignInClick() {
    var self = this;
    if (self.userInfo) {
      self.userInfo.setAt = new Date();
      sessionStorage.setItem('UserInfo', JSON.stringify(self.userInfo));
      $("#keepLogoutModal").modal('hide');
      self.isShowingKeepLogoutModal = false;
    } else {
      self._router.navigate(['/login']);
    }
  }

  showLeftMenu() {
    $(".navbar-fixed-top").css('z-index', '1100');
    $("#leftMenuModal").modal('show');
    $('#leftMenuModal').on('hidden.bs.modal', function () {
      $(".navbar-fixed-top").css('z-index', '1030');
    });
  }

  hideLeftMenu() {
    $("#leftMenuModal").modal('hide');
    $(".navbar-fixed-top").css('z-index', '1030');
  }

  onProfileClick() {
    this.hideLeftMenu();
    this._router.navigate(['/profile']);
  }

  onChangePasswordClick() {
    this.hideLeftMenu();
    this._router.navigate(['/change-password']);
  }

  btnSignInClick() {
    this._router.navigate(['/login']);
  }

  btnRegisterClick() {
    this._router.navigate(['/register']);
  }

  logout() {
    var self = this;
    if (self.userInfo) {
      self._baseService.patchBase('api/Credentials/' + self.userInfo.userInfo.LoginSoid + '/Logout', {LoginSoid: self.userInfo.userInfo.LoginSoid}).then((res:any)=>{
        self._router.navigate(['/login']);
      });
    } else {
      self._router.navigate(['/login']);
    }
  }
}
