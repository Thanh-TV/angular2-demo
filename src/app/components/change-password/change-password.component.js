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
var ChangePasswordComponent = (function () {
    function ChangePasswordComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.errorMessage = '';
        this.password = '';
        this.confirmPassword = '';
        this.isSuccess = false;
        this.headerConfig = {
            menuLeft: true,
            loggedIn: true
        };
    }
    ChangePasswordComponent.prototype.ngOnInit = function () {
        var self = this;
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo) {
            self.userInfo = JSON.parse(userInfo);
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    ChangePasswordComponent.prototype.btnSubmitClick = function (event) {
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
        };
        self._baseService.patchBase('api/Credentials/' + self.userInfo.userInfo.UserSoid + '/ChangePassword', data).then(function (res) {
            if (res && res.ok == false) {
                self.errorMessage = 'An error occurred. Please try again.';
                return;
            }
            self.isSuccess = true;
            setTimeout(function () {
                self._router.navigate(['/login']);
            }, 2000);
            $(event.target).removeClass('btn-loading');
        });
    };
    ChangePasswordComponent.prototype.txtPasswordKeyUp = function () {
        if (this.password == this.confirmPassword) {
            this.errorMessage = '';
        }
    };
    return ChangePasswordComponent;
}());
ChangePasswordComponent = __decorate([
    core_1.Component({
        selector: 'change-password-component',
        templateUrl: './change-password.component.html',
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], ChangePasswordComponent);
exports.ChangePasswordComponent = ChangePasswordComponent;
//# sourceMappingURL=change-password.component.js.map