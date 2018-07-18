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
var ModuleComponent = (function () {
    function ModuleComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.modules = [];
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
        this.newModule = {};
    }
    ModuleComponent.prototype.ngOnInit = function () {
        var self = this;
        self.modules = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Module').then(function (res) {
                if (res && res.ok != false) {
                    self.modules = res;
                }
                self.isLoading = false;
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    ModuleComponent.prototype.btnRemoveModuleClick = function (module, index) {
        this.deletingModuleObject = module;
        this.deletingModuleObjectIndex = index;
        this.deletingType = 'module';
        $("#confirmation_modal").modal('show');
    };
    ModuleComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url = 'api/Module/' + self.deletingModuleObject.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.modules.splice(self.deletingModuleObjectIndex, 1);
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    ModuleComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    ModuleComponent.prototype.btnAddModuleClick = function () {
        this.initNewModule();
        $("#modalAddModule").modal('show');
    };
    ModuleComponent.prototype.initNewModule = function () {
        this.newModule = {
            Name: '',
            Realm: '',
            Description: ''
        };
    };
    ModuleComponent.prototype.btnSaveModuleClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddModule");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Module', self.newModule).then(function (res) {
            if (res && res.Soid) {
                self.modules.push(res);
                $("#modalAddModule").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    ModuleComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
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
        var url = 'api/Module/' + editingObject.Soid;
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
    return ModuleComponent;
}());
ModuleComponent = __decorate([
    core_1.Component({
        selector: 'module-component',
        templateUrl: './module.component.html',
        styleUrls: ['./module.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], ModuleComponent);
exports.ModuleComponent = ModuleComponent;
//# sourceMappingURL=module.component.js.map