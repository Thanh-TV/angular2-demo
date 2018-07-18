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
var FinancialRegisterAddComponent = (function () {
    function FinancialRegisterAddComponent(_baseService) {
        this._baseService = _baseService;
        this.handleBtnSaveClick = new core_1.EventEmitter();
        this.baseObject = {
            checks: [],
            credits: []
        };
    }
    FinancialRegisterAddComponent.prototype.ngOnInit = function () {
        this.initBaseObject();
    };
    FinancialRegisterAddComponent.prototype.initBaseObject = function () {
        this.baseObject = {
            Bills001: "",
            Bills002: "",
            Bills005: "",
            Bills010: "",
            Bills020: "",
            Bills050: "",
            Bills100: "",
            Coins001: "",
            Coins005: "",
            Coins010: "",
            Coins025: "",
            Checks: [],
            Credits: []
        };
    };
    FinancialRegisterAddComponent.prototype.btnAddCheckCreditClick = function (type) {
        var addingObject = {
            Amount: '',
            Number: '',
            Owner: '',
            LedgerSoid: '',
            LedgerName: ''
        };
        if (type == 'check') {
            this.baseObject.Checks.push(addingObject);
        }
        else {
            this.baseObject.Credits.push(addingObject);
        }
    };
    FinancialRegisterAddComponent.prototype.btnSaveClick = function (event) {
        this.handleBtnSaveClick.emit({ event: event, data: this.baseObject });
    };
    return FinancialRegisterAddComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FinancialRegisterAddComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FinancialRegisterAddComponent.prototype, "ledgers", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], FinancialRegisterAddComponent.prototype, "handleBtnSaveClick", void 0);
FinancialRegisterAddComponent = __decorate([
    core_1.Component({
        selector: 'financial-register-add-component',
        templateUrl: './financial-register-add.component.html',
        styleUrls: ['./financial-register-add.component.css', '../../css/financial-base.scss'],
        providers: [base_service_1.BaseService]
    }),
    __metadata("design:paramtypes", [base_service_1.BaseService])
], FinancialRegisterAddComponent);
exports.FinancialRegisterAddComponent = FinancialRegisterAddComponent;
//# sourceMappingURL=financial-register-add.component.js.map