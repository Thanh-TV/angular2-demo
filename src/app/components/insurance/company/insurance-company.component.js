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
var InsuranceCompanyComponent = (function () {
    function InsuranceCompanyComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.companies = [];
        this.users = [];
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
        this.newCompany = {};
    }
    InsuranceCompanyComponent.prototype.ngOnInit = function () {
        var self = this;
        self.companies = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/InsuranceCompany/GetAll').then(function (res) {
                if (res && res.ok != false) {
                    self.companies = res;
                }
                self.isLoading = false;
                self.initScrollBar();
            });
            self._baseService.getBase('api/Person').then(function (res) {
                if (res && res.ok != false) {
                    self.users = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    InsuranceCompanyComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    InsuranceCompanyComponent.prototype.handleAfterSaving = function (oldData, newData) {
        var deletedIndexes = [];
        for (var i = 0; i < oldData.length; i++) {
            var existedIndex = -1;
            for (var j = 0; j < newData.length; j++) {
                if (oldData[i].Soid == newData[j].Soid) {
                    existedIndex = j;
                    break;
                }
            }
            if (existedIndex >= 0) {
                newData.splice(existedIndex, 1);
            }
            else {
                deletedIndexes.push(i);
            }
        }
        if (newData && newData.length > 0) {
            $.each(newData, function (index, item) {
                oldData.push(item);
            });
        }
        if (deletedIndexes && deletedIndexes.length > 0) {
            for (var t = deletedIndexes.length - 1; t >= 0; t--) {
                oldData.splice(deletedIndexes[t], 1);
            }
        }
    };
    InsuranceCompanyComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    InsuranceCompanyComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'product') {
            url = 'api/InsuranceCompany/' + self.deletingParentObject.Soid + '/DeleteInsuranceProduct/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'company') {
            url = 'api/InsuranceCompany/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'product') {
                self.handleAfterSaving(self.companies[self.deletingObjectIndex].Products, res.Products);
            }
            else if (self.deletingType == 'company') {
                self.companies.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    InsuranceCompanyComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    InsuranceCompanyComponent.prototype.btnAddCompanyProductClick = function (event, company) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/InsuranceCompany/' + company.Soid + '/AddInsuranceProduct';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res && res.Products != undefined) {
                self.handleAfterSaving(company.Products, res.Products);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    InsuranceCompanyComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Taxable', 'Active'];
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
        if (fieldName.indexOf('.') >= 0) {
            data.FieldName = fieldName.split('.')[0];
            data.Data = editingObject[data.FieldName];
            data.Data[fieldName.split('.')[1]] = value;
        }
        var url;
        if (type == 'company') {
            url = 'api/InsuranceCompany/' + editingObject.Soid;
        }
        else if (type == 'product') {
            url = 'api/InsuranceCompany/' + parentObject.Soid + '/UpdateInsuranceProduct/' + editingObject.Soid;
        }
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
                var dateFieldNames = ['BusinessStartDate'];
                if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return InsuranceCompanyComponent;
}());
InsuranceCompanyComponent = __decorate([
    core_1.Component({
        selector: 'insurance-company-component',
        templateUrl: './insurance-company.component.html',
        styleUrls: ['../../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], InsuranceCompanyComponent);
exports.InsuranceCompanyComponent = InsuranceCompanyComponent;
//# sourceMappingURL=insurance-company.component.js.map