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
var CourseReferenceComponent = (function () {
    function CourseReferenceComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.courseReferences = [];
        this.confirmation = {
            btnLeftText: 'Yes',
            btnRightText: 'No',
            title: 'Confirmation',
            content: 'Are you sure you want to delete this?',
        };
        this.confirmationType = "course-reference";
    }
    CourseReferenceComponent.prototype.ngOnInit = function () {
    };
    CourseReferenceComponent.prototype.ngOnChanges = function (changes) {
        var self = this;
        if (changes["parentObject"] && changes["parentObject"].currentValue != null) {
            var parentObject = changes["parentObject"].currentValue;
            if (parentObject) {
                self.courseReferences = parentObject.Courses;
                self.confirmationType = "course-reference-" + parentObject.Soid;
            }
        }
    };
    CourseReferenceComponent.prototype.prepareParentValues = function (parentObject, type) {
        if (type === void 0) { type = undefined; }
        if ((!type || type == 'course') && parentObject.Courses) {
            $.each(parentObject.Courses, function (idx2, course) {
                if (course.AddedOn) {
                    course.AddedOn = window.getDateInputFormat(course.AddedOn);
                }
            });
        }
    };
    CourseReferenceComponent.prototype.btnDeleteCourseClick = function (courseObject, parentObject) {
        this.deletingParentObject = parentObject;
        this.deletingCourseObject = courseObject;
        $("." + this.confirmationType).modal('show');
    };
    CourseReferenceComponent.prototype.btnConfirmDeletingClick = function (event) {
        var _this = this;
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = '';
        if (self.type == 'topic') {
            url = 'api/Topic/';
        }
        else if (self.type == 'certification') {
            url = 'api/Certification/';
        }
        else if (self.type == 'discipline') {
            url = 'api/Discipline/';
        }
        url += self.deletingParentObject.Soid + '/DeleteCourseReference/' + self.deletingCourseObject.Soid;
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.handleAfterSaving(_this.deletingParentObject.Courses, res.Courses);
            }
            $(event.target).removeClass('btn-loading');
            $("." + self.confirmationType).modal('hide');
        });
    };
    CourseReferenceComponent.prototype.btnConfirmCancelingClick = function () {
        $("." + this.confirmationType).modal('hide');
    };
    CourseReferenceComponent.prototype.btnAddCourseClick = function (event, parentObject) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.type == 'topic') {
            var url = 'api/Topic/';
        }
        else if (self.type == 'certification') {
            var url = 'api/Certification/';
        }
        else if (self.type == 'discipline') {
            var url = 'api/Discipline/';
        }
        url += parentObject.Soid + '/AddCourseReference';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res && res.Courses) {
                self.handleAfterSaving(parentObject.Courses, res.Courses);
                self.prepareParentValues(parentObject, 'course');
                self.initScrollBar();
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CourseReferenceComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    CourseReferenceComponent.prototype.handleAfterSaving = function (oldData, newData) {
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
    CourseReferenceComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
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
        var url = "";
        if (self.type == 'topic') {
            url = 'api/Topic/';
        }
        else if (self.type == 'certification') {
            url = 'api/Certification/';
        }
        else if (self.type == 'discipline') {
            url = 'api/Discipline/';
        }
        url += parentObject.Soid + '/UpdateCourseReference/' + editingObject.Soid;
        self._baseService.patchBase(url, data).then(function (res) {
            if (res.Changed) {
                if (boolInputFields.indexOf(fieldName) >= 0) {
                    var checked = (res.Data == 'true');
                    $(event.target).prop("checked", checked);
                }
                else {
                    $(event.target).val(res.Data);
                }
                if (fieldName == "CourseSoid") {
                    var selectedCourse = self.courses.filter(function (e) { return e.Soid == value; });
                    if (selectedCourse.length > 0) {
                        var courseNameData = {
                            FieldName: 'CourseName',
                            Data: selectedCourse[0].Name
                        };
                        self._baseService.patchBase(url, courseNameData).then(function (res) {
                            if (res.Changed) {
                                editingObject.CourseName = res.Data;
                            }
                            else {
                                editingObject.CourseName = res.Value;
                            }
                        });
                    }
                }
            }
            else {
                if (!res.Value)
                    res.Value = '';
                var dateInputs = ['AddedOn', 'ChangedOn', 'ReviewedOn', 'OfferedOn'];
                if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return CourseReferenceComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CourseReferenceComponent.prototype, "parentObject", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CourseReferenceComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], CourseReferenceComponent.prototype, "courses", void 0);
CourseReferenceComponent = __decorate([
    core_1.Component({
        selector: 'course-reference-component',
        templateUrl: './course-reference.component.html',
        styleUrls: ['./course-reference.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], CourseReferenceComponent);
exports.CourseReferenceComponent = CourseReferenceComponent;
//# sourceMappingURL=course-reference.component.js.map