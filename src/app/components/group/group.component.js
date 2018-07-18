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
var GroupComponent = (function () {
    function GroupComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
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
        this.newGroup = {};
    }
    GroupComponent.prototype.ngOnInit = function () {
        var self = this;
        self.groups = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Group').then(function (res) {
                if (res && res.ok != false) {
                    self.groups = res;
                }
                self.isLoading = false;
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    GroupComponent.prototype.btnRemoveGroupClick = function (group, index) {
        this.deletingGroupObject = group;
        this.deletingGroupObjectIndex = index;
        this.deletingType = 'group';
        $("#confirmation_modal").modal('show');
    };
    GroupComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url = 'api/Group/' + self.deletingGroupObject.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.groups.splice(self.deletingGroupObjectIndex, 1);
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    GroupComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    GroupComponent.prototype.btnAddGroupClick = function () {
        this.initNewGroup();
        $("#modalAddGroup").modal('show');
    };
    GroupComponent.prototype.initNewGroup = function () {
        this.newGroup = {
            GroupName: '',
            Order: 0,
            IsAdmin: false
        };
    };
    GroupComponent.prototype.btnSaveGroupClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddGroup");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Group', self.newGroup).then(function (res) {
            if (res && res.Soid) {
                self.groups.push(res);
                $("#modalAddGroup").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    GroupComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
        var self = this;
        var value = '';
        var boolInputFields = ['IsAdmin', 'Active'];
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
        var url = 'api/Group/' + editingObject.Soid;
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
                var dateInputs = [];
                if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return GroupComponent;
}());
GroupComponent = __decorate([
    core_1.Component({
        selector: 'group-component',
        templateUrl: './group.component.html',
        styleUrls: ['./group.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], GroupComponent);
exports.GroupComponent = GroupComponent;
//# sourceMappingURL=group.component.js.map