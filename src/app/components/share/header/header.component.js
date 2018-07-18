"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var base_service_1 = require("../../../services/base.service");
var HeaderComponent = (function () {
    function HeaderComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.loggedInPage = false;
        this.menuLeft = false;
        this.isHomePage = false;
        this.timeOutSecs = 0;
        this.isShowingKeepLogoutModal = false;
        this.userShortName = "";
        var self = this;
        self._router.events.subscribe(function (event) {
            if (event.url == '/home' || event.url == '/') {
                self.isHomePage = true;
            }
            else {
                self.isHomePage = false;
            }
        });
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var self = this;
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo) {
            self.userInfo = JSON.parse(userInfo);
            if (self.userInfo.userInfo.ScreenName) {
                self.userShortName = self.userInfo.userInfo.ScreenName[0];
            }
            else if (self.userInfo.userInfo.UserName) {
                self.userShortName = self.userInfo.userInfo.UserName[0];
            }
        }
        setInterval(function () {
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
                        $("#keepLogoutModal").modal({ backdrop: 'static', keyboard: false });
                        self.reduceTimeOutSecs();
                    }
                }
            }
            else if (self.loggedInPage) {
                self._router.navigate(['/login']);
            }
        }, 5000);
    };
    HeaderComponent.prototype.ngOnChanges = function (changes) {
        var self = this;
        if (changes["headerConfig"] && changes["headerConfig"].currentValue != null) {
            var headerConfig = changes["headerConfig"].currentValue;
            self.loggedInPage = headerConfig.loggedIn;
            self.menuLeft = headerConfig.menuLeft;
        }
    };
    HeaderComponent.prototype.reduceTimeOutSecs = function () {
        var self = this;
        if (self.timeOutSecs > 0 && self.isShowingKeepLogoutModal) {
            self.timeOutSecs -= 1;
            if (self.timeOutSecs == 0) {
                sessionStorage.setItem('UserInfo', '');
                $("#keepLogoutModal").modal('hide');
                self.logout();
                debugger;
                self._router.navigate(['/login']);
            }
            else {
                setTimeout(function () {
                    self.reduceTimeOutSecs();
                }, 1000);
            }
        }
    };
    HeaderComponent.prototype.btnKeepSignInClick = function () {
        var self = this;
        if (self.userInfo) {
            self.userInfo.setAt = new Date();
            sessionStorage.setItem('UserInfo', JSON.stringify(self.userInfo));
            $("#keepLogoutModal").modal('hide');
            self.isShowingKeepLogoutModal = false;
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    HeaderComponent.prototype.showLeftMenu = function () {
        $(".navbar-fixed-top").css('z-index', '1100');
        $("#leftMenuModal").modal('show');
        $('#leftMenuModal').on('hidden.bs.modal', function () {
            $(".navbar-fixed-top").css('z-index', '1030');
        });
    };
    HeaderComponent.prototype.hideLeftMenu = function () {
        $("#leftMenuModal").modal('hide');
        $(".navbar-fixed-top").css('z-index', '1030');
    };
    HeaderComponent.prototype.onProfileClick = function () {
        this.hideLeftMenu();
        this._router.navigate(['/profile']);
    };
    HeaderComponent.prototype.onChangePasswordClick = function () {
        this.hideLeftMenu();
        this._router.navigate(['/change-password']);
    };
    HeaderComponent.prototype.btnSignInClick = function () {
        this._router.navigate(['/login']);
    };
    HeaderComponent.prototype.btnRegisterClick = function () {
        this._router.navigate(['/register']);
    };
    HeaderComponent.prototype.logout = function () {
        var self = this;
        if (self.userInfo) {
            self._baseService.patchBase('api/Credentials/' + self.userInfo.userInfo.LoginSoid + '/Logout', { LoginSoid: self.userInfo.userInfo.LoginSoid }).then(function (res) {
                self._router.navigate(['/login']);
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    return HeaderComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], HeaderComponent.prototype, "headerConfig", void 0);
HeaderComponent = __decorate([
    core_1.Component({
        selector: 'header-component',
        templateUrl: './header.component.html',
        styleUrls: ['./header.component.scss'],
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], HeaderComponent);
exports.HeaderComponent = HeaderComponent;
//# sourceMappingURL=header.component.js.map