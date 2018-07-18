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
var InsuranceCustomerComponent = (function () {
    function InsuranceCustomerComponent(_router, _baseService) {
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
    InsuranceCustomerComponent.prototype.ngOnInit = function () {
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
    InsuranceCustomerComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    InsuranceCustomerComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'product') {
            url = 'api/InsuranceCompany/' + self.deletingParentObject.Soid + '/DeleteProduct/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'company') {
            url = 'api/InsuranceCompany/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'product') {
                self.companies[self.deletingObjectIndex].Products = res.Products;
            }
            else if (self.deletingType == 'company') {
                self.companies.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    InsuranceCustomerComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    InsuranceCustomerComponent.prototype.btnAddCompanyProductClick = function (event, company) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/InsuranceCompany/' + company.Soid + '/AddProduct';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                company.Products = res.Products;
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    InsuranceCustomerComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
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
            url = 'api/InsuranceCompany/' + parentObject.Soid + '/UpdateProduct/' + editingObject.Soid;
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
    return InsuranceCustomerComponent;
}());
InsuranceCustomerComponent = __decorate([
    core_1.Component({
        selector: 'insurance-customer-component',
        templateUrl: './insurance-customer.component.html',
        styleUrls: ['../../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], InsuranceCustomerComponent);
exports.InsuranceCustomerComponent = InsuranceCustomerComponent;
//# sourceMappingURL=insurance-customer.component.js.map