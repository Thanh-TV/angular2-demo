import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'course-component',
  templateUrl: './course.component.html',
  styleUrls: ['../../../share/css/base-panel.scss']
})

export class CourseComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  courses:any = [];
  users:any = [];
  students:any = [];
  deletingObject:any;
  deletingType:any;
  deletingObjectIndex:any;
  deletingParentObject:any;
  deletingSubParentObject:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };
  newCourse:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.courses = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Course').then((res:any) => {
        if (res && res.ok != false) {
          self.courses = res;
          $.each(self.courses, function(idx, course){
            self.prepareCourseValues(course);
          });
        }
        self.isLoading = false;
        self.initScrollBar();
      });
      self._baseService.getBase('api/Person').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
        }
      });
      self._baseService.getBase('api/Student').then((res:any) => {
        if (res && res.ok != false) {
          self.students = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  prepareCourseValues (course, type:any = undefined) {
    var self = this;

    if (!type) {
      course.ChangedOn = window.getDateInputFormat(course.ChangedOn);
      course.ReviewedOn = window.getDateInputFormat(course.ReviewedOn);
    }

    if ((!type || type=='asset') && course.Assets) {
      $.each(course.Assets, function(idx2, asset){
        if (course.PurchasedOn) {
          course.PurchasedOn = window.getDateInputFormat(course.PurchasedOn);
        }
      });
    }

    if ((!type || type=='schedule') && course.Schedule) {
      $.each(course.Schedule, function(idx3, schedule){
        if (schedule.OfferedOn) {
          schedule.OfferedOn = window.getDateInputFormat(schedule.OfferedOn);
        }
        $.each(schedule.Students, function(idx4, student){
          if (student.PassedOn) {
            student.PassedOn = window.getDateInputFormat(student.PassedOn);
          }
        });
      });
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  handleAfterSaving(oldData, newData) {
    var deletedIndexes:any = [];
    for (var i = 0; i < oldData.length; i++) {
      var existedIndex = -1;
      for (var j =0; j < newData.length; j++) {
        if (oldData[i].Soid == newData[j].Soid) {
          existedIndex = j;
          break;
        }
      }
      if (existedIndex >= 0) {
        newData.splice(existedIndex, 1);
      } else {
        deletedIndexes.push(i);
      }
    }

    if (newData && newData.length > 0) {
      $.each(newData, function(index, item){
        oldData.push(item);
      });
    }

    if (deletedIndexes && deletedIndexes.length > 0) {
      for (var t = deletedIndexes.length - 1; t >= 0; t--) {
        oldData.splice(deletedIndexes[t], 1);
      }
    }
  }

  btnDeleteClick(deletingObject, deletingType, index, deletingParentObject) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingType = deletingType;
    this.deletingParentObject = deletingParentObject;
    $("#confirmation_modal").modal('show');
  }

  btnDeleteSubObjectClick(deletingObject, deletingSubParentObject, deletingParentObject, i, type) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = i;
    this.deletingType = type;
    this.deletingParentObject = deletingParentObject;
    this.deletingSubParentObject = deletingSubParentObject;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "";
    if (self.deletingType == 'book') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseBook/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'schedule') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseSchedule/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'test') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseTest/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'slide') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/DeleteCourseSlide/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'question') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/CourseTest/' + self.deletingSubParentObject.Soid +'/DeleteTestQuestion/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'student') {
      url = 'api/Course/' + self.deletingParentObject.Soid + '/CourseSchedule/' + self.deletingSubParentObject.Soid +'/DeleteStudentSchedule/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'course') {
      url = 'api/Course/' + self.deletingObject.Soid;
    }

    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'book') {
        self.handleAfterSaving(self.courses[self.deletingObjectIndex].Books, res.Books);
      } else if (self.deletingType == 'schedule') {
        self.handleAfterSaving(self.courses[self.deletingObjectIndex].Schedule, res.Schedule);
      } else if (self.deletingType == 'test') {
        self.handleAfterSaving(self.courses[self.deletingObjectIndex].Tests, res.Tests);
      } else if (self.deletingType == 'slide') {
        self.handleAfterSaving(self.courses[self.deletingObjectIndex].Slides, res.Slides);
      } else if (self.deletingType == 'course') {
        self.courses.splice(self.deletingObjectIndex, 1);
      } else if (self.deletingType == 'question') {
        self.deletingSubParentObject.Questions.splice(self.deletingObjectIndex, 1);
      } else if (self.deletingType == 'student') {
        self.deletingSubParentObject.Students.splice(self.deletingObjectIndex, 1);
      }
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddClick(event, course, type) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = '';
    if (type == 'book') {
      url = 'api/Course/' + course.Soid + '/AddCourseBook';
    } else if (type == 'test') {
      url = 'api/Course/' + course.Soid + '/AddCourseTest';
    } else if (type == 'slide') {
      url = 'api/Course/' + course.Soid + '/AddCourseSlide';
    } else if (type == 'schedule') {
      url = 'api/Course/' + course.Soid + '/AddCourseSchedule';
    }
    self._baseService.postBase(url, {}).then((res:any) => {
      if (type == 'book' && res && res.Books != undefined) {
        self.handleAfterSaving(course.Books, res.Books);
      } else if (type == 'schedule' && res && res.Schedule != undefined) {
        self.handleAfterSaving(course.Schedule, res.Schedule);
      } else if (type == 'slide' && res && res.Slides != undefined) {
        self.handleAfterSaving(course.Slides, res.Slides);
      } else if (type == 'test' && res && res.Tests != undefined) {
        self.handleAfterSaving(course.Tests, res.Tests);
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddTestQuestionClick(event, course, test) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Course/' + course.Soid + '/CourseTest/' + test.Soid + '/AddTestQuestion';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res && res.Tests != undefined) {
        var currentTest:any = res.Tests.filter(function(e){ return e.Soid == test.Soid });
        self.handleAfterSaving(test.Questions, currentTest[0].Questions);
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddScheduleStudentClick(event, course, schedule) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Course/' + course.Soid + '/CourseSchedule/' + schedule.Soid + '/AddStudentSchedule';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res && res.Schedule != undefined) {
        var currentSchedule:any = res.Schedule.filter(function(e){ return e.Soid == schedule.Soid });
        self.handleAfterSaving(schedule.Students, currentSchedule[0].Students);
        self.prepareCourseValues(course, 'schedule');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}, parentSubObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Taxable', 'AvailableOnline', 'External', 'IsFreeClass', 'Paid', 'Active', 'Audio', 'AudioLocked', 'Correct'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
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
    } else if (type == 'book') {
      url = 'api/Course/' + parentObject.Soid + '/UpdateCourseBook/' + editingObject.Soid;
    } else if (type == 'schedule') {
      url = 'api/Course/' + parentObject.Soid + '/UpdateCourseSchedule/' + editingObject.Soid;
    } else if (type == 'test') {
      url = 'api/Course/' + parentObject.Soid + '/UpdateCourseTest/' + editingObject.Soid;
    } else if (type == 'slide') {
      url = 'api/Course/' + parentObject.Soid + '/UpdateCourseSlide/' + editingObject.Soid;
    } else if (type == 'question') {
      url = 'api/Course/' + parentObject.Soid + '/CourseTest/' + parentSubObject.Soid + '/UpdateTestQuestion/' + editingObject.Soid;
    } else if (type == 'student') {
      url = 'api/Course/' + parentObject.Soid + '/CourseSchedule/' + parentSubObject.Soid + '/UpdateStudentSchedule/' + editingObject.Soid;
    }
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (boolInputFields.indexOf(fieldName) >= 0) {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
      } else {
        if (!res.Value)
          res.Value = '';

        var dateFieldNames = ['ChangedOn', 'ReviewedOn'];
        if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
