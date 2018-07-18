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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var BaseService = (function () {
    function BaseService(http) {
        this.http = http;
        this.baseUrl = 'http://ec2-34-212-39-88.us-west-2.compute.amazonaws.com:8080/';
        this.browserName = '';
        if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
            this.browserName = 'Opera';
        }
        else if (typeof InstallTrigger !== 'undefined') {
            this.browserName = 'Firefox';
        }
        else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)) {
            this.browserName = 'Safari';
        }
        else if (false || !!document.documentMode) {
            this.browserName = 'IE';
        }
        else if (!(false || !!document.documentMode) && !!window.StyleMedia) {
            this.browserName = 'Edge';
        }
        else if (!!window.chrome && !!window.chrome.webstore) {
            this.browserName = 'Chrome';
        }
        else if (((!!window.chrome && !!window.chrome.webstore) || isOpera) && !!window.CSS) {
            this.browserName = 'Blink';
        }
    }
    BaseService.prototype.checkUserOperator = function () {
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            userInfo = JSON.parse(userInfo);
            userInfo.setAt = new Date();
            sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
            this.userInfo = userInfo;
        }
    };
    BaseService.prototype.initHeaderOptions = function (withFormData) {
        if (withFormData === void 0) { withFormData = false; }
        var headers = new http_1.Headers();
        headers.append('Token', '{F0290832-DAAF-48B9-9A09-9C64CD824C2E}');
        if (!withFormData)
            headers.append('Content-Type', 'application/json');
        else
            headers.append('Content-Type', 'application/x-www-form-urlencoded');
        if (this.userInfo && this.userInfo.userInfo) {
            headers.append('UserSoid', this.userInfo.userInfo.UserSoid);
            headers.append('UserName', this.userInfo.userInfo.UserName);
        }
        var options = new http_1.RequestOptions({ headers: headers });
        return options;
    };
    BaseService.prototype.getBase = function (url) {
        var _this = this;
        this.checkUserOperator();
        var options = this.initHeaderOptions();
        return new Promise(function (resolve) {
            _this.http.get(_this.baseUrl + url, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            }, function (error) {
                resolve(error);
            });
        });
    };
    BaseService.prototype.postBase = function (url, data, withBrowser, withFormData) {
        var _this = this;
        if (withBrowser === void 0) { withBrowser = false; }
        if (withFormData === void 0) { withFormData = false; }
        this.checkUserOperator();
        if (withBrowser) {
            data.Browser = this.browserName;
        }
        var options = this.initHeaderOptions(withFormData);
        return new Promise(function (resolve) {
            _this.http.post(_this.baseUrl + url, data, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            }, function (error) {
                resolve(error);
            });
        });
    };
    BaseService.prototype.patchBase = function (url, data, withBrowser) {
        var _this = this;
        if (withBrowser === void 0) { withBrowser = false; }
        this.checkUserOperator();
        if (withBrowser) {
            data.Browser = this.browserName;
        }
        var options = this.initHeaderOptions();
        return new Promise(function (resolve) {
            _this.http.patch(_this.baseUrl + url, data, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            }, function (error) {
                resolve(error);
            });
        });
    };
    BaseService.prototype.deleteBase = function (url) {
        var _this = this;
        this.checkUserOperator();
        var options = this.initHeaderOptions();
        return new Promise(function (resolve) {
            _this.http.delete(_this.baseUrl + url, options)
                .map(function (res) { return res.json(); })
                .subscribe(function (data) {
                resolve(data);
            }, function (error) {
                resolve(error);
            });
        });
    };
    return BaseService;
}());
BaseService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], BaseService);
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map