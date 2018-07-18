import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'task-component',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss', '../../share/css/base-comment.scss', '../../share/css/base-panel.scss']
})

export class TaskComponent implements OnInit {
  baseApiUrl = "http://ec2-34-212-39-88.us-west-2.compute.amazonaws.com:8020/";
  isLoading:any = false;
  userInfo:any;
  tasks:any = [];
  users:any = [];
  offices:any = [];
  deletingTaskObject:any;
  deletingCommentObject:any;
  deletingType:any;
  deletingTaskObjectIndex:any;
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
  notifyingObject:any;
  notifyUser:any = "";
  newTask:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.tasks = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Task').then((res:any) => {
        if (res && res.ok != false) {
          self.tasks = res;
          $.each(self.tasks, function(idx, task){
            self.prepareTaskData(task);
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
      self._baseService.getBase('api/Office').then((res:any) => {
        if (res && res.ok != false) {
          self.offices = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  prepareTaskData(task:any, type:any = null) {
    var self = this;
    if (!type) {
      if (task.DueOn)
        task.DueOn = window.getDateInputFormat(task.DueOn);
    }

    if (!type || type == 'attachment') {
      $.each(task.Attachments, function(idx, attachment){
        attachment.DownloadUrl = self.baseApiUrl + 'Documents/Tasks/' + task.Soid + '/' + attachment.FileName;
      });
    }
  }

  saveTags(tagObject) {
    var self = this;
    if (tagObject) {
      var taskId = $(tagObject.element).attr("id").split('Tags')[1];
      var url = 'api/Task/' + taskId;
      var data = {
        FieldName: 'Tags',
        Data: tagObject.value
      };
      self._baseService.patchBase(url, data).then((res) => {
        if (res.Changed) {
          $(tagObject.element).html(tagObject.value).trigger('change');
        } else {
          if (!res.Value)
            res.Value = "";
          $(tagObject.element).html(res.Value).trigger('change');
        }
      });
    }
  }

  btnAddCommentClick(event, task) {
    this.handleAddingComment(event, task, 'button');
  }

  txtCommentKeyUp(event, task) {
    if (event.keyCode == 13) {
      this.handleAddingComment(event, task);
    }
  }

  handleAddingComment(event, task, type:any = null) {
    var self = this;
    var comment:any = $(event.target).parents('.base-comment-item').find('textarea').val();
    var data:any = {
      SqlId: task.Soid,
      Content: comment
    };
    if (type == 'button') {
      if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
        return;
      }
      $(event.target).addClass('btn-loading');
    }
    self._baseService.postBase('api/Task/' + task.Soid +'/AddTaskComment', data).then((res)=>{
      if (res && res.Soid) {
        task.Comments = res.Comments;
        $(event.target).parents('.base-comment-item').find('textarea').val('');
      }
      if (type == 'button') {
        $(event.target).removeClass('btn-loading');
      }
    });
  }

  btnNotifyUserClick(task) {
    this.notifyingObject = task;
    $("#modalTaskNotifyUser").modal('show');
  }

  btnProcessNotifyUserClick(event, task) {
    var self = this;
    var url:any;
    if (self.notifyUser != "") {
      url = 'api/Task/' + self.notifyingObject.Soid + '/NotifyUser/' + self.notifyUser;
    } else {
      url = 'api/Task/' + self.notifyingObject.Soid + '/NotifyAll';
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase(url, {}).then((res)=>{
      if (!(res && res.ok == false)) {
        window.showSuccess('Notified!');
        $("#modalTaskNotifyUser").modal('hide');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnUpdateCommentClick(task, comment, event) {
    var self = this;
    var url:any = 'api/Task/' + task.Soid + '/UpdateTaskComment/' + comment.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var data = {
      FieldName: 'Content',
      Data: comment.Content
    };
    self._baseService.patchBase(url, data).then((res)=>{
      if (res && res.Changed) {

      } else {
        comment.Content = res.Value;
      }
      comment.isEditing = false;
      $(event.target).removeClass('btn-loading');
    });
  }

  btnDeleteCommentClick(task, comment, index) {
    this.deletingTaskObject = task;
    this.deletingCommentObject = comment;
    this.deletingTaskObjectIndex = index;
    this.deletingType = 'comment';
    $("#confirmation_modal").modal('show');
  }

  btnRemoveTaskClick(task, index) {
    this.deletingTaskObject = task;
    this.deletingTaskObjectIndex = index;
    this.deletingType = 'task';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    var url:any;
    if (self.deletingType == 'comment') {
      url = 'api/Task/' + self.deletingTaskObject.Soid + '/DeleteTaskComment/' + self.deletingCommentObject.Soid;
    } else {
      url = 'api/Task/' + self.deletingTaskObject.Soid;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        if (self.deletingType == 'comment') {
          if (res.Comments)
            self.tasks[self.deletingTaskObjectIndex].Comments = res.Comments;
        } else {
          self.tasks.splice(self.deletingTaskObjectIndex, 1);
        }
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddTaskClick() {
    this.initNewTask();
    $("#modalAddTask").modal('show');
  }

  initNewTask() {
    this.newTask = {
      Subject: '',
      Description: '',
      AssigneeSoid: '',
      Priority: '2',
      DueOn: window.getDateInputFormat(new Date()),
      Status: 'Open'
    };
  }

  btnSaveTaskClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddTask");
    if (invalid) {
      return;
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Task', self.newTask).then((res:any) => {
      if (res && res.Soid) {
        res.DueOn = window.getDateInputFormat(res.DueOn);
        self.tasks.push(res);
        self.initScrollBar();
        $("#modalAddTask").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAttachmentFileClick(i) {
    $("#taskFileInput" + i).click();
  }

  onFileChange(event, task, i) {
    var self = this;
    var files = event.target.files;
    if (files && files[0]) {
      var formData = new FormData($('#frmTaskAttachment' + i)[0]);
      formData.append("CreatedBy", self.userInfo.userInfo.UserName);
      formData.append("CreatedID", self.userInfo.userInfo.UserSoid);
      formData.append("TaskSoid", task.Soid);
      formData.append("Subject", task.Subject);
      var url:any = 'api/Task/' + task.Soid + '/AddTaskAttachment';
      $("#btnAttachFile" + i).addClass('btn-loading');
      self._baseService.postBase(url, formData, false, true).then((res)=> {
        $("#btnAttachFile" + i).removeClass('btn-loading');
        if (res && res.Attachments) {
          task.Attachments = res.Attachments;
          self.prepareTaskData(task, 'attachment');
        }
      });
    }
  }

  txtValueChange(event, type, fieldName, editingObject) {
    var self = this;
    var value:any = '';
    var boolInputFields = [];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/Task/' + editingObject.Soid;
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
        if (fieldName == 'DueOn' && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
