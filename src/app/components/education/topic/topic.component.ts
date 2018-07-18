import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'topic-component',
  templateUrl: './topic.component.html',
  styleUrls: ['../../../share/css/education-base.scss']
})

export class TopicComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  topics:any = [];
  courses:any = [];
  deletingTopicObject:any;
  deletingTopicCourseObject:any;
  deletingType:any;
  deletingTopicObjectIndex:any;
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
  newTopic:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.topics = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Topic').then((res:any) => {
        if (res && res.ok != false) {
          self.topics = res;
          $.each(self.topics, function(idx, topic){
            self.prepareTopicValues(topic);
          });
        }
        self.isLoading = false;
        self.initScrollBar();
      });
      self._baseService.getBase('api/Course').then((res:any) => {
        if (res && res.ok != false) {
          self.courses = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  prepareTopicValues (topic, type:any = undefined) {
    if ((!type || type=='course') && topic.Courses) {
      $.each(topic.Courses, function(idx2, course){
        if (course.AddedOn) {
          course.AddedOn = window.getDateInputFormat(course.AddedOn);
        }
      });
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  btnRemoveTopicClick(topic, index) {
    this.deletingTopicObject = topic;
    this.deletingTopicObjectIndex = index;
    this.deletingType = 'topic';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Topic/' + self.deletingTopicObject.Soid;
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.topics.splice(self.deletingTopicObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddTopicClick() {
    this.initNewTopic();
    $("#modalAddTopic").modal('show');
  }

  initNewTopic() {
    this.newTopic = {
      Name: ''
    };
  }

  btnSaveTopicClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddTopic");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Topic', self.newTopic).then((res:any) => {
      if (res && res.Soid) {
        self.topics.push(res);
        $("#modalAddTopic").modal('hide');
        self.initScrollBar();
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}) {
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

    var url = 'api/Topic/' + editingObject.Soid;
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
        var dateInputs:any = [];
        if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
