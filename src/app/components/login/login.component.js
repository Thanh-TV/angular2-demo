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
var base_service_1 = require("../../services/base.service");
var LoginComponent = (function () {
    function LoginComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.errorMessage = '';
        this.email = '';
        this.password = '';
        this.headerConfig = {
            menuLeft: false,
            loggedIn: false
        };
    }
    LoginComponent.prototype.ngOnInit = function () {
    };
    LoginComponent.prototype.btnSubmitClick = function (event) {
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
        self._baseService.postBase('api/Credentials/Login', loginData, true).then(function (res) {
            if (res && res.LoginSoid) {
                var userInfo = {
                    setAt: new Date(),
                    userInfo: res
                };
                sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
                self._baseService.patchBase('api/Credentials/' + res.LoginSoid + '/TrackLogin', {}).then(function (res) {
                });
                self._router.navigate(['/dashboard']);
            }
            else {
                self.errorMessage = 'Invalid log in or server error. Please try again';
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    LoginComponent.prototype.txtLoginKeyUp = function () {
        if (this.email.trim() != '' && this.password.trim() != '') {
            this.errorMessage = '';
        }
    };
    LoginComponent.prototype.btnForgotPasswordClick = function () {
        this._router.navigate(['/forgot-password']);
    };
    return LoginComponent;
}());
LoginComponent = __decorate([
    core_1.Component({
        selector: 'login-component',
        templateUrl: './login.component.html',
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], LoginComponent);
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map