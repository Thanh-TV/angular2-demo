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
var UserComponent = (function () {
    function UserComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.users = [];
        this.groups = [];
        this.confirmation = {
            btnLeftText: 'Yes',
            btnRightText: 'No',
            title: 'Confirmation',
            content: 'Are you sure you want to delete this?',
        };
        this.headerConfig = {
            menuLeft: true,
            loggedIn: true
        };
        this.newUser = {};
    }
    UserComponent.prototype.ngOnInit = function () {
        var self = this;
        self.users = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/User').then(function (res) {
                if (res && res.ok != false) {
                    self.users = res;
                    $.each(self.users, function (idx, user) {
                        self.prepareUserValues(user);
                    });
                }
                self.isLoading = false;
            });
            self._baseService.getBase('api/Group').then(function (res) {
                if (res && res.ok != false) {
                    self.groups = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    UserComponent.prototype.prepareUserValues = function (user, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if (user.ExpiresOn) {
            user.ExpiresOn = window.getDateInputFormat(user.ExpiresOn);
        }
        if (user.LastTokenRequest) {
            user.LastTokenRequest = window.getDateInputFormat(user.LastTokenRequest);
        }
        if (user.LastLogin) {
            user.LastLogin = window.getDateInputFormat(user.LastLogin);
        }
    };
    UserComponent.prototype.btnRemoveUserClick = function (user, index) {
        this.deletingUserObject = user;
        this.deletingUserObjectIndex = index;
        this.deletingType = 'user';
        $("#confirmation_modal").modal('show');
    };
    UserComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url = 'api/user/' + self.deletingUserObject.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.users.splice(self.deletingUserObjectIndex, 1);
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    UserComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    UserComponent.prototype.btnAddUserClick = function () {
        this.initNewUser();
        $("#modalAddUser").modal('show');
    };
    UserComponent.prototype.initNewUser = function () {
        this.newUser = {
            UserName: '',
            ScreenName: '',
            EmailAddress: '',
            Role: 'User'
        };
    };
    UserComponent.prototype.btnSaveUserClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddUser");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/user', self.newUser).then(function (res) {
            if (res && res.Soid) {
                self.prepareUserValues(res);
                self.users.push(res);
                $("#modalAddUser").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    UserComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
        var self = this;
        var value = '';
        var boolInputFields = ['IsNew', 'Reset'];
        if (boolInputFields.indexOf(fieldName) >= 0) {
            value = $(event.target).prop('checked');
        }
        else {
            value = $(event.target).val().trim();
        }
        var data = {
            FieldName: fieldName,
            Data: value
        };
        var url = 'api/user/' + editingObject.Soid;
        self._baseService.patchBase(url, data).then(function (res) {
            if (res.Changed) {
                if (boolInputFields.indexOf(fieldName) >= 0) {
                    var checked = (res.Data == 'true');
                    $(event.target).prop("checked", checked);
                }
                else {
                    $(event.target).val(res.Data);
                }
            }
            else {
                if (!res.Value)
                    res.Value = '';
                var dateInputs = ['ExpiresOn', 'LastTokenRequest', 'LastLogin'];
                if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return UserComponent;
}());
UserComponent = __decorate([
    core_1.Component({
        selector: 'user-component',
        templateUrl: './user.component.html',
        styleUrls: ['./user.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], UserComponent);
exports.UserComponent = UserComponent;
//# sourceMappingURL=user.component.js.map