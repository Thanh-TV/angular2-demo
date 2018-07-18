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
var ResetPasswordComponent = (function () {
    function ResetPasswordComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.headerConfig = {
            menuLeft: false,
            loggedIn: false
        };
        this.errorMessage = '';
        this.password = '';
        this.confirmPassword = '';
        this.token = "";
        this.isSuccess = false;
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        var urlArr = window.location.href.split('?token=');
        if (urlArr.length == 1) {
            this.errorMessage = 'Token is required.';
        }
        else {
            this.token = urlArr[urlArr.length - 1];
            this.token = this.token.replace('%3D', '=');
        }
    };
    ResetPasswordComponent.prototype.btnSubmitClick = function (event) {
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
        self._baseService.postBase('api/Credentials/Validate', { Token: self.token }, true).then(function (res) {
            if (res.ok != false && res.UserSoid) {
                var data = { UserSoid: res.UserSoid, Password: self.password.trim() };
                self._baseService.patchBase('api/Credentials/' + res.UserSoid + '/ChangePassword', data, true).then(function (res) {
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
            }
            else {
                $(event.target).removeClass('btn-loading');
                self.errorMessage = 'The token is expired.';
            }
        });
    };
    ResetPasswordComponent.prototype.txtPasswordKeyUp = function () {
        if (this.password == this.confirmPassword) {
            this.errorMessage = '';
        }
    };
    return ResetPasswordComponent;
}());
ResetPasswordComponent = __decorate([
    core_1.Component({
        selector: 'reset-component',
        templateUrl: './reset-password.component.html',
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], ResetPasswordComponent);
exports.ResetPasswordComponent = ResetPasswordComponent;
//# sourceMappingURL=reset-password.component.js.map