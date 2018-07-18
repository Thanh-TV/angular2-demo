import { Component, OnInit, Input, OnChanges,  SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'course-reference-component',
  templateUrl: './course-reference.component.html',
  styleUrls: ['./course-reference.component.scss']
})

export class CourseReferenceComponent implements OnInit, OnChanges {
  @Input() parentObject:any;
  @Input() type:any;
  @Input() courses:any;
  userInfo:any;
  courseReferences:any = [];
  deletingParentObject:any;
  deletingCourseObject:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  confirmationType = "course-reference";

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    var self = this;
    if (changes["parentObject"] && changes["parentObject"].currentValue != null) {
        var parentObject = changes["parentObject"].currentValue;
        if (parentObject) {
          self.courseReferences = parentObject.Courses;
          self.confirmationType = "course-reference-" + parentObject.Soid;
        }
    }
  }

  prepareParentValues (parentObject, type:any = undefined) {
    if ((!type || type=='course') && parentObject.Courses) {
      $.each(parentObject.Courses, function(idx2, course){
        if (course.AddedOn) {
          course.AddedOn = window.getDateInputFormat(course.AddedOn);
        }
      });
    }
  }

  btnDeleteCourseClick(courseObject, parentObject) {
    this.deletingParentObject = parentObject;
    this.deletingCourseObject = courseObject;
    $("." + this.confirmationType).modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = '';
    if (self.type == 'topic') {
      url = 'api/Topic/';
    } else if (self.type == 'certification') {
      url = 'api/Certification/';
    } else if (self.type == 'discipline') {
      url = 'api/Discipline/';
    }
    url += self.deletingParentObject.Soid + '/DeleteCourseReference/' + self.deletingCourseObject.Soid;
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.handleAfterSaving(this.deletingParentObject.Courses, res.Courses);
      }
      $(event.target).removeClass('btn-loading');
      $("." + self.confirmationType).modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("." + this.confirmationType).modal('hide');
  }

  btnAddCourseClick(event, parentObject) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "";
    if (self.type == 'topic') {
      var url:any = 'api/Topic/';
    } else if (self.type == 'certification') {
      var url:any = 'api/Certification/'
    } else if (self.type == 'discipline') {
      var url:any = 'api/Discipline/'
    }
    url += parentObject.Soid + '/AddCourseReference';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res && res.Courses) {
        self.handleAfterSaving(parentObject.Courses, res.Courses);
        self.prepareParentValues(parentObject, 'course');
        self.initScrollBar();
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
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

  txtValueChange(event, type, fieldName, editingObject:any, parentObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Active'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };
    var url:any = "";
    if (self.type == 'topic') {
      url = 'api/Topic/';
    } else if (self.type == 'certification') {
      url = 'api/Certification/';
    } else if (self.type == 'discipline') {
      url = 'api/Discipline/';
    }
    url += parentObject.Soid + '/UpdateCourseReference/' + editingObject.Soid;
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (boolInputFields.indexOf(fieldName) >= 0) {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
        if (fieldName == "CourseSoid") {
          var selectedCourse = self.courses.filter(function(e){return e.Soid == value});
          if (selectedCourse.length > 0) {
            var courseNameData = {
              FieldName: 'CourseName',
              Data: selectedCourse[0].Name
            };
            self._baseService.patchBase(url, courseNameData).then((res) => {
              if (res.Changed) {
                editingObject.CourseName = res.Data;
              } else {
                editingObject.CourseName = res.Value;
              }
            });
          }
        }
      } else {
        if (!res.Value)
          res.Value = '';
        var dateInputs:any = ['AddedOn', 'ChangedOn', 'ReviewedOn', 'OfferedOn'];
        if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
