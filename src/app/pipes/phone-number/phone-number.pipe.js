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
var PADDING = "000000";
var PhoneNumberPipe = (function () {
    function PhoneNumberPipe() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = ".";
        this.THOUSANDS_SEPARATOR = "'";
    }
    PhoneNumberPipe.prototype.transform = function (value) {
        value = value.replace(/[^0-9\.]+/g, '');
        value = value + '';
        var formattedValue = '';
        if (value.length > 0) {
            if (value.length > 10)
                value = value.substring(0, 10);
            for (var i = 0; i < value.length; i++) {
                if (i == 0) {
                    formattedValue += '(' + value[i];
                }
                else if (i == 2) {
                    formattedValue += value[i] + ')';
                }
                else if (i == 3) {
                    formattedValue += ' ' + value[i];
                }
                else if (i == 6) {
                    formattedValue += '-' + value[i];
                }
                else {
                    formattedValue += value[i];
                }
            }
        }
        return formattedValue;
    };
    PhoneNumberPipe.prototype.parse = function (value, fractionSize) {
        if (fractionSize === void 0) { fractionSize = 2; }
        var _a = (value || "").split(this.DECIMAL_SEPARATOR), integer = _a[0], _b = _a[1], fraction = _b === void 0 ? "" : _b;
        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");
        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
            : "";
        return integer + fraction;
    };
    return PhoneNumberPipe;
}());
PhoneNumberPipe = __decorate([
    core_1.Pipe({ name: "phoneNumberPipe" }),
    __metadata("design:paramtypes", [])
], PhoneNumberPipe);
exports.PhoneNumberPipe = PhoneNumberPipe;
//# sourceMappingURL=phone-number.pipe.js.map