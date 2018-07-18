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
var FinancialRegisterComponent = (function () {
    function FinancialRegisterComponent(_baseService) {
        this._baseService = _baseService;
        this.isLoading = false;
        this.registers = [];
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
        this.modalFinancialRegisterType = "opening";
    }
    FinancialRegisterComponent.prototype.ngOnInit = function () {
        var self = this;
        self.isLoading = true;
        self.loadData();
        self._baseService.getBase('api/Ledger').then(function (res) {
            self.ledgers = res;
        });
        window.initScrollBar();
    };
    FinancialRegisterComponent.prototype.loadData = function () {
        var self = this;
        var url = 'api/EndOfDay/' + self.officeId + '/DailyReports';
        self._baseService.getBase(url).then(function (res) {
            self.isLoading = false;
            self.registers = res;
        });
    };
    FinancialRegisterComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        $("#confirmation_modal").modal('show');
    };
    FinancialRegisterComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
    };
    FinancialRegisterComponent.prototype.btnSaveOpeningClosingClick = function (response) {
        var self = this;
        var event = response.event;
        var data = response.data;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        var url = 'api/EndOfDay/' + self.officeId + '/Opening';
        $(event.target).addClass('btn-loading');
        self._baseService.postBase(url, data).then(function (result) {
            if (result && result.ok == false) {
                window.showError();
            }
            else {
                self.loadData();
                $("#modalFinancialRegister").modal('hide');
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    FinancialRegisterComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    FinancialRegisterComponent.prototype.btnOpeningClosingClick = function (type) {
        this.modalFinancialRegisterType = type;
        $("#modalFinancialRegister").modal('show');
    };
    FinancialRegisterComponent.prototype.btnViewMoreClick = function (event, register) {
        var self = this;
        if (!register.details) {
            $(event.target).addClass('btn-loading');
            var url = 'api/EndOfDay/' + register.Soid;
            self._baseService.getBase(url).then(function (res) {
                register.details = res;
                register.isShowMore = true;
                $(event.target).removeClass('btn-loading');
            });
        }
        else {
            register.isShowMore = true;
        }
    };
    return FinancialRegisterComponent;
}());
FinancialRegisterComponent = __decorate([
    core_1.Component({
        selector: 'financial-register-component',
        templateUrl: './financial-register.component.html',
        styleUrls: ['./financial-register.component.css', '../../../share/css/base-panel.scss'],
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [base_service_1.BaseService])
], FinancialRegisterComponent);
exports.FinancialRegisterComponent = FinancialRegisterComponent;
//# sourceMappingURL=financial-register.component.js.map