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
var base_service_1 = require("../../services/base.service");
var RegisterComponent = (function () {
    function RegisterComponent(_baseService) {
        this._baseService = _baseService;
        this.headerConfig = {
            menuLeft: false,
            loggedIn: false
        };
        this.errorMessage = '';
        this.email = '';
        this.firstName = '';
        this.lastName = '';
        this.isSuccess = false;
    }
    RegisterComponent.prototype.ngOnInit = function () {
        var self = this;
        //$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
        //  if (data && data.geobytesremoteip) {
        //   self.localIp = data.geobytesremoteip;
        // }
        //});
    };
    RegisterComponent.prototype.btnSubmitClick = function (event) {
        var self = this;
        if (self.email.trim() == '') {
            self.errorMessage = 'Please enter your email.';
            return;
        }
        else if (self.firstName.trim() == '') {
            self.errorMessage = 'Please enter your first name.';
            return;
        }
        else if (self.lastName.trim() == '') {
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
        };
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/User/Registration', data).then(function (res) {
            if (res && res.ok == false) {
                self.errorMessage = 'This email is already used.';
                self.isSuccess = false;
            }
            else {
                self.isSuccess = true;
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    RegisterComponent.prototype.validateEmail = function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };
    RegisterComponent.prototype.txtEmailKeyUp = function () {
        if ((this.email.trim() != '' && this.errorMessage == 'Please enter your email.') ||
            (this.errorMessage == 'Email is invalid.' && this.validateEmail(this.email.trim())) ||
            this.errorMessage == 'This email is already used.') {
            this.errorMessage = '';
        }
        this.isSuccess = false;
    };
    RegisterComponent.prototype.txtFirstNameKeyUp = function () {
        if (this.errorMessage == 'Please enter your first name.') {
            this.errorMessage = '';
        }
        this.isSuccess = false;
    };
    RegisterComponent.prototype.txtLastNameKeyUp = function () {
        if (this.errorMessage == 'Please enter your last name.') {
            this.errorMessage = '';
        }
        this.isSuccess = false;
    };
    return RegisterComponent;
}());
RegisterComponent = __decorate([
    core_1.Component({
        selector: 'register-component',
        templateUrl: './register.component.html',
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [base_service_1.BaseService])
], RegisterComponent);
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map