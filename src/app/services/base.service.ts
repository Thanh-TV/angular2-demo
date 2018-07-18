import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

declare var localStorage:any;
declare var JSON:any;
declare var window:any;
declare var InstallTrigger:any;
declare var SafariRemoteNotification:any;
declare var isOpera:any;
declare var safari:any;
declare var document:any;
declare var documentMode:any;
declare var opr:any;

@Injectable()
export class BaseService {
  baseUrl:any = 'http://ec2-34-212-39-88.us-west-2.compute.amazonaws.com:8080/';
  browserName:any = '';
  userInfo: any;

  constructor(public http: Http) {
    if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
      this.browserName = 'Opera';
    } else if (typeof InstallTrigger !== 'undefined') {
      this.browserName = 'Firefox';
    } else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification)) {
      this.browserName = 'Safari';
    } else if (/*@cc_on!@*/false || !!document.documentMode) {
      this.browserName = 'IE';
    } else if (!(/*@cc_on!@*/false || !!document.documentMode) && !!window.StyleMedia) {
      this.browserName = 'Edge';
    } else if (!!window.chrome && !!window.chrome.webstore) {
      this.browserName = 'Chrome';
    } else if (((!!window.chrome && !!window.chrome.webstore) || isOpera) && !!window.CSS) {
      this.browserName = 'Blink';
    }
  }

  checkUserOperator() {
    var userInfo:any = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
      userInfo = JSON.parse(userInfo);
      userInfo.setAt = new Date();
      sessionStorage.setItem('UserInfo', JSON.stringify(userInfo));
      this.userInfo = userInfo;
    }
  }

  initHeaderOptions(withFormData:any = false) {
    let headers = new Headers();
    headers.append('Token', '{F0290832-DAAF-48B9-9A09-9C64CD824C2E}');
    if (!withFormData)
      headers.append('Content-Type', 'application/json');
    else
      headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (this.userInfo && this.userInfo.userInfo) {
      headers.append('UserSoid', this.userInfo.userInfo.UserSoid);
      headers.append('UserName', this.userInfo.userInfo.UserName);
    }
    let options = new RequestOptions({headers : headers });
    return options;
  }

  getBase(url: string): Promise<any>{
    this.checkUserOperator();
    var options = this.initHeaderOptions();
    return new Promise(resolve => {
      this.http.get(this.baseUrl + url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        });
    });
  }

  postBase(url: string, data:any, withBrowser:any = false, withFormData:any = false): Promise<any>{
    this.checkUserOperator();
    if (withBrowser) {
      data.Browser = this.browserName;
    }
    var options = this.initHeaderOptions(withFormData);
    return new Promise(resolve => {
      this.http.post(this.baseUrl + url, data, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        });
    });
  }

  patchBase(url: string, data:any, withBrowser:any = false): Promise<any>{
    this.checkUserOperator();
    if (withBrowser) {
      data.Browser = this.browserName;
    }
    var options = this.initHeaderOptions();
    return new Promise(resolve => {
      this.http.patch(this.baseUrl + url, data, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        });
    });
  }

  deleteBase(url: string): Promise<any>{
    this.checkUserOperator();
    var options = this.initHeaderOptions();
    return new Promise(resolve => {
      this.http.delete(this.baseUrl + url, options)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          resolve(error);
        });
    });
  }
}
