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
var CompanyComponent = (function () {
    function CompanyComponent(_router, _baseService) {
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
    CompanyComponent.prototype.ngOnInit = function () {
        var self = this;
        self.companies = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Company').then(function (res) {
                if (res && res.ok != false) {
                    self.companies = res;
                    $.each(self.companies, function (idx, company) {
                        self.prepareCompanyValues(company);
                    });
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
    CompanyComponent.prototype.prepareCompanyValues = function (company, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if (!type) {
            company.BusinessStartDate = window.getDateInputFormat(company.BusinessStartDate);
        }
        if ((!type || type == 'asset') && company.Assets) {
            $.each(company.Assets, function (idx2, asset) {
                if (asset.PurchasedOn) {
                    asset.PurchasedOn = window.getDateInputFormat(asset.PurchasedOn);
                }
            });
        }
    };
    CompanyComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    CompanyComponent.prototype.handleAfterSaving = function (oldData, newData) {
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
    CompanyComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    CompanyComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'asset') {
            url = 'api/Company/' + self.deletingParentObject.Soid + '/DeleteCompanyAsset/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'company') {
            url = 'api/Company/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'asset') {
                self.handleAfterSaving(self.companies[self.deletingObjectIndex].Assets, res.Assets);
                self.prepareCompanyValues(self.companies[self.deletingObjectIndex], 'asset');
            }
            else if (self.deletingType == 'company') {
                self.companies.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    CompanyComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    CompanyComponent.prototype.btnAddCompanyClick = function () {
        this.initNewCompany();
        $("#modalAddCompany").modal('show');
    };
    CompanyComponent.prototype.initNewCompany = function () {
        this.newCompany = {
            CompanyName: '',
            PhoneNumber: '',
            Region: ''
        };
    };
    CompanyComponent.prototype.btnSaveCompanyClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddCompany");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Company';
        self._baseService.postBase(url, self.newCompany).then(function (res) {
            if (res && res.Soid) {
                self.companies.push(res);
                self.prepareCompanyValues(self.companies[self.companies.length - 1]);
                self.initScrollBar();
                $("#modalAddCompany").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CompanyComponent.prototype.btnAddCompanyAssetClick = function (event, company) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Company/' + company.Soid + '/AddCompanyAsset';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(company.Assets, res.Assets);
                self.prepareCompanyValues(company, 'asset');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CompanyComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Own', 'Verified'];
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
            url = 'api/Company/' + editingObject.Soid;
        }
        else if (type == 'asset') {
            url = 'api/Company/' + parentObject.Soid + '/UpdateCompanyAsset/' + editingObject.Soid;
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
                var dateFieldNames = ['BusinessStartDate', 'PurchasedOn'];
                if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return CompanyComponent;
}());
CompanyComponent = __decorate([
    core_1.Component({
        selector: 'company-component',
        templateUrl: './company.component.html',
        styleUrls: ['./company.component.scss', '../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], CompanyComponent);
exports.CompanyComponent = CompanyComponent;
//# sourceMappingURL=company.component.js.map