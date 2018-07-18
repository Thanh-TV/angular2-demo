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
var base_service_1 = require("../../../services/base.service");
var TopicComponent = (function () {
    function TopicComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.topics = [];
        this.courses = [];
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
        this.newTopic = {};
    }
    TopicComponent.prototype.ngOnInit = function () {
        var self = this;
        self.topics = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Topic').then(function (res) {
                if (res && res.ok != false) {
                    self.topics = res;
                    $.each(self.topics, function (idx, topic) {
                        self.prepareTopicValues(topic);
                    });
                }
                self.isLoading = false;
                self.initScrollBar();
            });
            self._baseService.getBase('api/Course').then(function (res) {
                if (res && res.ok != false) {
                    self.courses = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    TopicComponent.prototype.prepareTopicValues = function (topic, type) {
        if (type === void 0) { type = undefined; }
        if ((!type || type == 'course') && topic.Courses) {
            $.each(topic.Courses, function (idx2, course) {
                if (course.AddedOn) {
                    course.AddedOn = window.getDateInputFormat(course.AddedOn);
                }
            });
        }
    };
    TopicComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    TopicComponent.prototype.btnRemoveTopicClick = function (topic, index) {
        this.deletingTopicObject = topic;
        this.deletingTopicObjectIndex = index;
        this.deletingType = 'topic';
        $("#confirmation_modal").modal('show');
    };
    TopicComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Topic/' + self.deletingTopicObject.Soid;
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.topics.splice(self.deletingTopicObjectIndex, 1);
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    TopicComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    TopicComponent.prototype.btnAddTopicClick = function () {
        this.initNewTopic();
        $("#modalAddTopic").modal('show');
    };
    TopicComponent.prototype.initNewTopic = function () {
        this.newTopic = {
            Name: ''
        };
    };
    TopicComponent.prototype.btnSaveTopicClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddTopic");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Topic', self.newTopic).then(function (res) {
            if (res && res.Soid) {
                self.topics.push(res);
                $("#modalAddTopic").modal('hide');
                self.initScrollBar();
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    TopicComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Active'];
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
        var url = 'api/Topic/' + editingObject.Soid;
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
                var dateInputs = [];
                if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return TopicComponent;
}());
TopicComponent = __decorate([
    core_1.Component({
        selector: 'topic-component',
        templateUrl: './topic.component.html',
        styleUrls: ['../../../share/css/education-base.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], TopicComponent);
exports.TopicComponent = TopicComponent;
//# sourceMappingURL=topic.component.js.map