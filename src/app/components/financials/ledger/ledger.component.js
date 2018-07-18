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
var base_service_1 = require("../../../services/base.service");
var FinancialLedgerComponent = (function () {
    function FinancialLedgerComponent(_baseService) {
        this._baseService = _baseService;
        this.isLoading = false;
        this.ledgers = [];
        this.headerConfig = {
            menuLeft: true,
            loggedIn: true
        };
        this.confirmation = {
            btnLeftText: 'Yes',
            btnRightText: 'No',
            title: 'Confirmation',
            content: 'Are you sure you want to delete this?',
        };
        this.officeId = '5b1b1505a21c1906e494da35';
        this.newLedger = {};
    }
    FinancialLedgerComponent.prototype.ngOnInit = function () {
        var self = this;
        self.isLoading = true;
        self._baseService.getBase('api/Ledger').then(function (res) {
            self.isLoading = false;
            self.ledgers = res;
        });
    };
    FinancialLedgerComponent.prototype.btnDeleteClick = function (deletingObject, index) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        $("#confirmation_modal").modal('show');
    };
    FinancialLedgerComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "api/Ledger/" + self.deletingObject.Soid;
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                $("#confirmation_modal").modal('hide');
                $(event.target).removeClass('btn-loading');
                return window.showError();
            }
            self.ledgers.splice(self.deletingObjectIndex, 1);
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    FinancialLedgerComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    FinancialLedgerComponent.prototype.initNewLedger = function () {
        this.newLedger = {
            AccountName: "",
            AccountNumber: "",
            BankName: "",
            AgencyName: ""
        };
    };
    FinancialLedgerComponent.prototype.btnAddLedgerClick = function () {
        this.initNewLedger();
        $("#modalAddLedger").modal('show');
    };
    FinancialLedgerComponent.prototype.btnSaveLedgerClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddTicket");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "api/Ledger/";
        self._baseService.postBase(url, self.newLedger).then(function (res) {
            if (res && res.ok == false) {
                $("#modalAddLedger").modal('hide');
                $(event.target).removeClass('btn-loading');
                return window.showError();
            }
            self.ledgers.push(res);
            $("#modalAddLedger").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    FinancialLedgerComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
        var self = this;
        var value = '';
        var boolInputFields = [];
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
        var url = 'api/Ledger/' + editingObject.Soid;
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
                if (fieldName == 'DueOn' && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return FinancialLedgerComponent;
}());
FinancialLedgerComponent = __decorate([
    core_1.Component({
        selector: 'financial-ledger-component',
        templateUrl: './ledger.component.html',
        styleUrls: ['./ledger.component.css', '../../../share/css/base-panel.scss'],
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [base_service_1.BaseService])
], FinancialLedgerComponent);
exports.FinancialLedgerComponent = FinancialLedgerComponent;
//# sourceMappingURL=ledger.component.js.map