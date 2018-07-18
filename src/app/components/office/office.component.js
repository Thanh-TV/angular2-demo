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
var OfficeComponent = (function () {
    function OfficeComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.offices = [];
        this.users = [];
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
        this.notifyUser = "";
        this.newAppointment = { Participants: [] };
        this.totalNewParticipants = 0;
        this.totalAddedNewParticipants = 0;
        this.newEmployee = {};
        this.pageSize = 20;
        this.newOffice = {};
    }
    OfficeComponent.prototype.ngOnInit = function () {
        var self = this;
        self.offices = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Office').then(function (res) {
                if (res && res.ok != false) {
                    self.offices = res;
                    $.each(self.offices, function (idx, office) {
                        self.prepareOfficeValues(office);
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
            self._baseService.getBase('api/Module').then(function (res) {
                if (res && res.ok != false) {
                    self.modules = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    OfficeComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    OfficeComponent.prototype.prepareOfficeValues = function (office, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if ((!type || type == 'employee') && office.Employees) {
            $.each(office.Employees, function (idx1, employee) {
                if (employee.Start) {
                    employee.Start = window.getDateInputFormat(employee.Start);
                }
                if (employee.End) {
                    employee.End = window.getDateInputFormat(employee.End);
                }
                if (employee.DefaultClockIn) {
                    employee.DefaultClockIn = window.getTimeInputFormat(employee.DefaultClockIn);
                }
                if (employee.DefaultClockOut) {
                    employee.DefaultClockOut = window.getTimeInputFormat(employee.DefaultClockOut);
                }
            });
        }
        if ((!type || type == 'module') && office.Modules) {
            $.each(office.Modules, function (idx2, module) {
                if (module.Start) {
                    module.Start = window.getTimeInputFormat(module.Start);
                }
                if (module.End) {
                    module.End = window.getTimeInputFormat(module.End);
                }
            });
        }
        if ((!type || type == 'customer') && office.Customers) {
            office.totalCustomers = office.Customers.length;
            office.totalCustomerPages = parseInt((office.totalCustomers / self.pageSize) + '');
            if (office.totalCustomers % self.pageSize != 0)
                office.totalCustomerPages += 1;
            office.pageNumbers = [];
            for (var i = 0; i < office.totalCustomerPages; i++) {
                office.pageNumbers.push(i + 1);
            }
            office.maxCustomerPageIndex = parseInt((office.totalCustomerPages / 5) + '');
            if (office.totalCustomerPages % 5 != 0)
                office.maxCustomerPageIndex += 1;
            if (!type) {
                office.currentCustomerPage = 1;
                office.currentCustomerPageIndex = 1;
            }
            $.each(office.Customers, function (idx3, customer) {
            });
        }
        if ((!type || type == 'asset') && office.Assets) {
            $.each(office.Assets, function (idx2, asset) {
                if (asset.PurchasedOn) {
                    asset.PurchasedOn = window.getDateInputFormat(asset.PurchasedOn);
                }
            });
        }
        if ((!type || type == 'priceList') && office.PriceLists) {
            $.each(office.PriceLists, function (idx3, priceList) {
                if (priceList.StartDate) {
                    priceList.StartDate = window.getDateInputFormat(priceList.StartDate);
                }
                if (priceList.EndDate) {
                    priceList.EndDate = window.getDateInputFormat(priceList.EndDate);
                }
            });
        }
        if (!type) {
            setTimeout(function () {
                $("div.collapse").addClass('in');
            }, 500);
        }
    };
    OfficeComponent.prototype.btnPageMoreClick = function (office, type) {
        if (type == 0) {
            if (office.currentCustomerPageIndex > 1)
                office.currentCustomerPageIndex -= 1;
        }
        else {
            if (office.currentCustomerPageIndex < office.maxCustomerPageIndex)
                office.currentCustomerPageIndex += 1;
        }
    };
    OfficeComponent.prototype.btnNextPreviousClick = function (office, type) {
        if (type == 0) {
            if (office.currentCustomerPage > 1)
                office.currentCustomerPage -= 1;
        }
        else {
            if (office.currentCustomerPage < office.totalCustomerPages)
                office.currentCustomerPage += 1;
        }
    };
    OfficeComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject, deletingSubParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        this.deletingSubParentObject = deletingSubParentObject;
        $("#confirmation_modal").modal('show');
    };
    OfficeComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'branch') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteBranch/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'employee') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteEmployee/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'module') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeModule/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'asset') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeAsset/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'customer') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeleteOfficeCustomer/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'priceList') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/DeletePriceList/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'priceListItem') {
            url = 'api/Office/' + self.deletingParentObject.Soid + '/PriceList/' + self.deletingSubParentObject.Soid + '/DeletePriceListItem/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'office') {
            url = 'api/Office/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'branch') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].Branches, res.Branches);
            }
            else if (self.deletingType == 'employee') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].Employees, res.Employees);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'employee');
            }
            else if (self.deletingType == 'module') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].Modules, res.Modules);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'module');
            }
            else if (self.deletingType == 'asset') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].Assets, res.Assets);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'asset');
            }
            else if (self.deletingType == 'customer') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].Customers, res.Customers);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'customer');
            }
            else if (self.deletingType == 'priceList') {
                self.handleAfterSaving(self.offices[self.deletingObjectIndex].PriceLists, res.PriceLists);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'priceList');
            }
            else if (self.deletingType == 'priceListItem') {
                var currentPriceList = res.PriceLists.filter(function (e) { return e.Soid == self.deletingSubParentObject.Soid; });
                self.handleAfterSaving(self.deletingSubParentObject.Items, currentPriceList[0].Items);
                self.prepareOfficeValues(self.offices[self.deletingObjectIndex], 'priceList');
            }
            else if (self.deletingType == 'office') {
                self.offices.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.handleAfterSaving = function (oldData, newData) {
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
    OfficeComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    OfficeComponent.prototype.btnAddOfficeClick = function () {
        this.initNewOffice();
        $("#modalAddOffice").modal('show');
    };
    OfficeComponent.prototype.initNewOffice = function () {
        this.newOffice = {
            CompanyName: '',
            OfficeName: '',
            PhoneNumber: '',
            Region: ''
        };
    };
    OfficeComponent.prototype.btnSaveOfficeClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddOffice");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office';
        self._baseService.postBase(url, self.newOffice).then(function (res) {
            if (res && res.Soid) {
                self.offices.push(res);
                self.prepareOfficeValues(self.offices[self.offices.length - 1]);
                $("#modalAddOffice").modal('hide');
                self.initScrollBar();
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.btnAddBranchClick = function (event, office) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + office.Soid + '/AddBranch';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(office.Branches, res.Branches);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.btnAddModuleClick = function (event, office) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + office.Soid + '/AddOfficeModule';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(office.Modules, res.Modules);
                self.prepareOfficeValues(office, 'module');
                $("#modalAddEmployee").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.btnAddPriceListClick = function (event, office) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + office.Soid + '/AddPriceList';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(office.PriceLists, res.PriceLists);
                self.prepareOfficeValues(office, 'priceList');
                $("#modalAddEmployee").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.btnAddAssetClick = function (event, office) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + office.Soid + '/AddOfficeAsset';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(office.Assets, res.Assets);
                self.prepareOfficeValues(office, 'asset');
                $("#modalAddEmployee").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.btnAddPriceListItemClick = function (event, office, priceList) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + office.Soid + '/PriceList/' + priceList.Soid + '/AddPriceListItem';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                var currentPriceList = res.PriceLists.filter(function (e) { return e.Soid == priceList.Soid; });
                self.handleAfterSaving(priceList.Items, currentPriceList[0].Items);
                self.prepareOfficeValues(office, 'priceList');
                $("#modalAddEmployee").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.initNewEmployee = function () {
        this.newEmployee = {
            PersonSoid: '',
            Position: '',
            Start: '',
            End: '',
            DefaultClockIn: '',
            DefaultClockOut: ''
        };
    };
    OfficeComponent.prototype.btnAddEmployeeClick = function (office) {
        this.initNewEmployee();
        this.currentOffice = office;
        $("#modalAddEmployee").modal('show');
    };
    OfficeComponent.prototype.btnSaveEmployeeClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddEmployee");
        if (invalid) {
            return;
        }
        var selectedPerson = self.users.filter(function (e) { return e.Soid == self.newEmployee.PersonSoid; });
        if (selectedPerson && selectedPerson.length > 0) {
            self.newEmployee.PersonName = ((selectedPerson[0].NameFirst ? selectedPerson[0].NameFirst : '') + ' ' + (selectedPerson[0].NameLast ? selectedPerson[0].NameLast : '')).trim();
            if (selectedPerson[0].EmailAddresses && selectedPerson[0].EmailAddresses.length > 0) {
                for (var i = 0; i < selectedPerson[0].EmailAddresses.length; i++) {
                    if (selectedPerson[0].EmailAddresses[i].Address) {
                        self.newEmployee.EmailAddress = selectedPerson[0].EmailAddresses[i].Address;
                        break;
                    }
                }
            }
            if (selectedPerson[0].DLNumber)
                self.newEmployee.PhoneNumber = selectedPerson[0].DLNumber;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Office/' + self.currentOffice.Soid + '/AddEmployee';
        self._baseService.postBase(url, self.newEmployee).then(function (res) {
            if (res) {
                self.handleAfterSaving(self.currentOffice.Employees, res.Employees);
                self.prepareOfficeValues(self.currentOffice, 'employee');
                $("#modalAddEmployee").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    OfficeComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject, parentSubObject) {
        if (parentObject === void 0) { parentObject = {}; }
        if (parentSubObject === void 0) { parentSubObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Active', 'TimeStamping', 'TimeClockAdmin', 'ViewTraining', 'Global', 'PromptOnChange', 'GlobalSearch', 'GlobalReporting', 'Notifications'];
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
        var url;
        if (type == 'office') {
            url = 'api/Office/' + editingObject.Soid;
        }
        else if (type == 'branch') {
            url = 'api/Office/' + parentObject.Soid + '/UpdateBranch/' + editingObject.Soid;
        }
        else if (type == 'employee') {
            url = 'api/Office/' + parentObject.Soid + '/UpdateEmployee/' + editingObject.Soid;
        }
        else if (type == 'module') {
            url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeModule/' + editingObject.Soid;
        }
        else if (type == 'asset') {
            url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeAsset/' + editingObject.Soid;
        }
        else if (type == 'customer') {
            url = 'api/Office/' + parentObject.Soid + '/UpdateOfficeCustomer/' + editingObject.Soid;
        }
        else if (type == 'priceList') {
            url = 'api/Office/' + parentObject.Soid + '/UpdatePriceList/' + editingObject.Soid;
        }
        else if (type == 'priceListItem') {
            url = 'api/Office/' + parentObject.Soid + '/PriceList/' + parentSubObject.Soid + '/UpdatePriceListItem/' + editingObject.Soid;
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
                var dateFieldNames = ['Start', 'End', 'StartDate', 'EndDate', 'PurchasedOn'];
                if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return OfficeComponent;
}());
OfficeComponent = __decorate([
    core_1.Component({
        selector: 'office-component',
        templateUrl: './office.component.html',
        styleUrls: ['./office.component.scss', '../../share/css/base-comment.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], OfficeComponent);
exports.OfficeComponent = OfficeComponent;
//# sourceMappingURL=office.component.js.map