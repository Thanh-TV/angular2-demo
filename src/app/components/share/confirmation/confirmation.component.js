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
var ConfirmationComponent = (function () {
    function ConfirmationComponent() {
        this.handleBtnLeftClick = new core_1.EventEmitter();
        this.handleBtnRightClick = new core_1.EventEmitter();
    }
    ConfirmationComponent.prototype.ngOnInit = function () {
    };
    ConfirmationComponent.prototype.btnLeftClick = function (event) {
        this.handleBtnLeftClick.emit(event);
    };
    ConfirmationComponent.prototype.btnRightClick = function (event) {
        this.handleBtnRightClick.emit(event);
    };
    return ConfirmationComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmationComponent.prototype, "btnLeftText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmationComponent.prototype, "btnRightText", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmationComponent.prototype, "title", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmationComponent.prototype, "content", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ConfirmationComponent.prototype, "confirmationType", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ConfirmationComponent.prototype, "handleBtnLeftClick", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], ConfirmationComponent.prototype, "handleBtnRightClick", void 0);
ConfirmationComponent = __decorate([
    core_1.Component({
        selector: 'confirmation-component',
        templateUrl: './confirmation.component.html',
        styleUrls: ['./confirmation.component.scss']
    }),
    __metadata("design:paramtypes", [])
], ConfirmationComponent);
exports.ConfirmationComponent = ConfirmationComponent;
//# sourceMappingURL=confirmation.component.js.map