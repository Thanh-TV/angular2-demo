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
var ForgotPasswordComponent = (function () {
    function ForgotPasswordComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.errorMessage = '';
        this.email = '';
        this.isSuccess = false;
        this.headerConfig = {
            menuLeft: false,
            loggedIn: false
        };
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
    };
    ForgotPasswordComponent.prototype.btnSubmitClick = function (event) {
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
        self._baseService.postBase('api/Credentials/PasswordRecovery', data, true).then(function (res) {
            if (!res) {
                self.isSuccess = true;
            }
            else {
                self.isSuccess = false;
                self.errorMessage = 'Email not found.';
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    ForgotPasswordComponent.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    ForgotPasswordComponent.prototype.txtEmailKeyUp = function () {
        if ((this.email.trim() != '' && this.errorMessage == 'Please enter your email.') || (this.errorMessage == 'Email is invalid.' && this.validateEmail(this.email.trim())) || this.errorMessage == 'Email not found.') {
            this.errorMessage = '';
        }
        this.isSuccess = false;
    };
    return ForgotPasswordComponent;
}());
ForgotPasswordComponent = __decorate([
    core_1.Component({
        selector: 'forgot-password-component',
        templateUrl: './forgot-password.component.html',
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], ForgotPasswordComponent);
exports.ForgotPasswordComponent = ForgotPasswordComponent;
//# sourceMappingURL=forgot-password.component.js.map