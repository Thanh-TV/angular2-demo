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
var CourseComponent = (function () {
    function CourseComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.courses = [];
        this.users = [];
        this.students = [];
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
        this.newCourse = {};
    }
    CourseComponent.prototype.ngOnInit = function () {
        var self = this;
        self.courses = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Course').then(function (res) {
                if (res && res.ok != false) {
                    self.courses = res;
                    $.each(self.courses, function (idx, course) {
                        self.prepareCourseValues(course);
                    });
                }
                self.isLoading = false;
                self.initScrollBar();
            });
            self._baseService.getBase('api/Person').then(function (res) {
                if (res && res.ok != false) {
                    self.users = res;
                }
            });
            self._baseService.getBase('api/Student').then(function (res) {
                if (res && res.ok != false) {
                    self.students = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    CourseComponent.prototype.prepareCourseValues = function (course, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if (!type) {
            course.ChangedOn = window.getDateInputFormat(course.ChangedOn);
            course.ReviewedOn = window.getDateInputFormat(course.ReviewedOn);
        }
        if ((!type || type == 'asset') && course.Assets) {
            $.each(course.Assets, function (idx2, asset) {
                if (course.PurchasedOn) {
                    course.PurchasedOn = window.getDateInputFormat(course.PurchasedOn);
                }
            });
        }
        if ((!type || type == 'schedule') && course.Schedule) {
            $.each(course.Schedule, function (idx3, schedule) {
                if (schedule.OfferedOn) {
                    schedule.OfferedOn = window.getDateInputFormat(schedule.OfferedOn);
                }
                $.each(schedule.Students, function (idx4, student) {
                    if (student.PassedOn) {
                        student.PassedOn = window.getDateInputFormat(student.PassedOn);
                    }
                });
            });
        }
    };
    CourseComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    CourseComponent.prototype.handleAfterSaving = function (oldData, newData) {
        var deletedIndexes = [];
        for (var i = 0; i < oldData.length; i++) {
            var existedIndex = -1;
            for (var j = 0; j < newData.length; j++) {
                if (oldData[i].Soid == newData[j].Soid) {
                    existedIndex = j;
                    break;
                }
            }
            if (existedIndex >= 0) {
                newData.splice(existedIndex, 1);
            }
            else {
                deletedIndexes.push(i);
            }
        }
        if (newData && newData.length > 0) {
            $.each(newData, function (index, item) {
                oldData.push(item);
            });
        }
        if (deletedIndexes && deletedIndexes.length > 0) {
            for (var t = deletedIndexes.length - 1; t >= 0; t--) {
                oldData.splice(deletedIndexes[t], 1);
            }
        }
    };
    CourseComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    CourseComponent.prototype.btnDeleteSubObjectClick = function (deletingObject, deletingSubParentObject, deletingParentObject, i, type) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = i;
        this.deletingType = type;
        this.deletingParentObject = deletingParentObject;
        this.deletingSubParentObject = deletingSubParentObject;
        $("#confirmation_modal").modal('show');
    };
    CourseComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'book') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseBook/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'schedule') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseSchedule/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'test') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseTest/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'slide') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseSlide/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'question') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/CourseTest/' + self.deletingSubParentObject.Soid + '/DeleteTestQuestion/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'student') {
            url = 'api/Course/' + self.deletingParentObject.Soid + '/CourseSchedule/' + self.deletingSubParentObject.Soid + '/DeleteStudentSchedule/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'course') {
            url = 'api/Course/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'book') {
                self.handleAfterSaving(self.courses[self.deletingObjectIndex].Books, res.Books);
            }
            else if (self.deletingType == 'schedule') {
                self.handleAfterSaving(self.courses[self.deletingObjectIndex].Schedule, res.Schedule);
            }
            else if (self.deletingType == 'test') {
                self.handleAfterSaving(self.courses[self.deletingObjectIndex].Tests, res.Tests);
            }
            else if (self.deletingType == 'slide') {
                self.handleAfterSaving(self.courses[self.deletingObjectIndex].Slides, res.Slides);
            }
            else if (self.deletingType == 'course') {
                self.courses.splice(self.deletingObjectIndex, 1);
            }
            else if (self.deletingType == 'question') {
                self.deletingSubParentObject.Questions.splice(self.deletingObjectIndex, 1);
            }
            else if (self.deletingType == 'student') {
                self.deletingSubParentObject.Students.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    CourseComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    CourseComponent.prototype.btnAddClick = function (event, course, type) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = '';
        if (type == 'book') {
            url = 'api/Course/' + course.Soid + '/AddCourseBook';
        }
        else if (type == 'test') {
            url = 'api/Course/' + course.Soid + '/AddCourseTest';
        }
        else if (type == 'slide') {
            url = 'api/Course/' + course.Soid + '/AddCourseSlide';
        }
        else if (type == 'schedule') {
            url = 'api/Course/' + course.Soid + '/AddCourseSchedule';
        }
        self._baseService.postBase(url, {}).then(function (res) {
            if (type == 'book' && res && res.Books != undefined) {
                self.handleAfterSaving(course.Books, res.Books);
            }
            else if (type == 'schedule' && res && res.Schedule != undefined) {
                self.handleAfterSaving(course.Schedule, res.Schedule);
            }
            else if (type == 'slide' && res && res.Slides != undefined) {
                self.handleAfterSaving(course.Slides, res.Slides);
            }
            else if (type == 'test' && res && res.Tests != undefined) {
                self.handleAfterSaving(course.Tests, res.Tests);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CourseComponent.prototype.btnAddTestQuestionClick = function (event, course, test) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Course/' + course.Soid + '/CourseTest/' + test.Soid + '/AddTestQuestion';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res && res.Tests != undefined) {
                var currentTest = res.Tests.filter(function (e) { return e.Soid == test.Soid; });
                self.handleAfterSaving(test.Questions, currentTest[0].Questions);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CourseComponent.prototype.btnAddScheduleStudentClick = function (event, course, schedule) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Course/' + course.Soid + '/CourseSchedule/' + schedule.Soid + '/AddStudentSchedule';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res && res.Schedule != undefined) {
                var currentSchedule = res.Schedule.filter(function (e) { return e.Soid == schedule.Soid; });
                self.handleAfterSaving(schedule.Students, currentSchedule[0].Students);
                self.prepareCourseValues(course, 'schedule');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CourseComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject, parentSubObject) {
        if (parentObject === void 0) { parentObject = {}; }
        if (parentSubObject === void 0) { parentSubObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Taxable', 'AvailableOnline', 'External', 'IsFreeClass', 'Paid', 'Active', 'Audio', 'AudioLocked', 'Correct'];
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
        if (fieldName.indexOf('.') >= 0) {
            data.FieldName = fieldName.split('.')[0];
            data.Data = editingObject[data.FieldName];
            data.Data[fieldName.split('.')[1]] = value;
        }
        var url;
        if (type == 'course') {
            url = 'api/Course/' + editingObject.Soid;
        }
        else if (type == 'book') {
            url = 'api/Course/' + parentObject.Soid + '/UpdateCourseBook/' + editingObject.Soid;
        }
        else if (type == 'schedule') {
            url = 'api/Course/' + parentObject.Soid + '/UpdateCourseSchedule/' + editingObject.Soid;
        }
        else if (type == 'test') {
            url = 'api/Course/' + parentObject.Soid + '/UpdateCourseTest/' + editingObject.Soid;
        }
        else if (type == 'slide') {
            url = 'api/Course/' + parentObject.Soid + '/UpdateCourseSlide/' + editingObject.Soid;
        }
        else if (type == 'question') {
            url = 'api/Course/' + parentObject.Soid + '/CourseTest/' + parentSubObject.Soid + '/UpdateTestQuestion/' + editingObject.Soid;
        }
        else if (type == 'student') {
            url = 'api/Course/' + parentObject.Soid + '/CourseSchedule/' + parentSubObject.Soid + '/UpdateStudentSchedule/' + editingObject.Soid;
        }
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
                var dateFieldNames = ['ChangedOn', 'ReviewedOn'];
                if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return CourseComponent;
}());
CourseComponent = __decorate([
    core_1.Component({
        selector: 'course-component',
        templateUrl: './course.component.html',
        styleUrls: ['../../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], CourseComponent);
exports.CourseComponent = CourseComponent;
//# sourceMappingURL=course.component.js.map