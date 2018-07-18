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
var LeftMenuComponent = (function () {
    function LeftMenuComponent(_router) {
        this._router = _router;
        this.currentPage = '';
        var self = this;
        self._router.events.subscribe(function (event) {
            self.currentPage = event.url.replace('/', '');
        });
    }
    LeftMenuComponent.prototype.ngOnInit = function () {
        window.initScrollBar();
    };
    LeftMenuComponent.prototype.redirectTo = function (page) {
        $("#leftMenuModal").modal('hide');
        this._router.navigate(['/' + page]);
    };
    return LeftMenuComponent;
}());
LeftMenuComponent = __decorate([
    core_1.Component({
        selector: 'left-menu-component',
        templateUrl: './left-menu.component.html',
        styleUrls: ['./left-menu.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router])
], LeftMenuComponent);
exports.LeftMenuComponent = LeftMenuComponent;
//# sourceMappingURL=left-menu.component.js.map