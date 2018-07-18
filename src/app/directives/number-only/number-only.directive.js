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
var NumberOnlyFormatterDirective = (function () {
    function NumberOnlyFormatterDirective(elementRef) {
        this.elementRef = elementRef;
    }
    NumberOnlyFormatterDirective.prototype.ngOnInit = function () {
    };
    NumberOnlyFormatterDirective.prototype.onKeyPress = function (evt, value) {
        var theEvent = evt || window.event;
        var key = theEvent.keyCode || theEvent.which;
        key = String.fromCharCode(key);
        var regex = /[0-9]|\./;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault)
                theEvent.preventDefault();
        }
    };
    return NumberOnlyFormatterDirective;
}());
__decorate([
    core_1.HostListener("keypress", ["$event", "$event.target.value"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], NumberOnlyFormatterDirective.prototype, "onKeyPress", null);
NumberOnlyFormatterDirective = __decorate([
    core_1.Directive({ selector: "[numberOnlyFormatter]" }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], NumberOnlyFormatterDirective);
exports.NumberOnlyFormatterDirective = NumberOnlyFormatterDirective;
//# sourceMappingURL=number-only.directive.js.map