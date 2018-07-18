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
var base_service_1 = require("../../services/base.service");
var TaskComponent = (function () {
    function TaskComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.baseApiUrl = "http://ec2-34-212-39-88.us-west-2.compute.amazonaws.com:8020/";
        this.isLoading = false;
        this.tasks = [];
        this.users = [];
        this.offices = [];
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
        this.notifyUser = "";
        this.newTask = {};
    }
    TaskComponent.prototype.ngOnInit = function () {
        var self = this;
        self.tasks = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Task').then(function (res) {
                if (res && res.ok != false) {
                    self.tasks = res;
                    $.each(self.tasks, function (idx, task) {
                        self.prepareTaskData(task);
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
            self._baseService.getBase('api/Office').then(function (res) {
                if (res && res.ok != false) {
                    self.offices = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    TaskComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    TaskComponent.prototype.prepareTaskData = function (task, type) {
        if (type === void 0) { type = null; }
        var self = this;
        if (!type) {
            if (task.DueOn)
                task.DueOn = window.getDateInputFormat(task.DueOn);
        }
        if (!type || type == 'attachment') {
            $.each(task.Attachments, function (idx, attachment) {
                attachment.DownloadUrl = self.baseApiUrl + 'Documents/Tasks/' + task.Soid + '/' + attachment.FileName;
            });
        }
    };
    TaskComponent.prototype.saveTags = function (tagObject) {
        var self = this;
        if (tagObject) {
            var taskId = $(tagObject.element).attr("id").split('Tags')[1];
            var url = 'api/Task/' + taskId;
            var data = {
                FieldName: 'Tags',
                Data: tagObject.value
            };
            self._baseService.patchBase(url, data).then(function (res) {
                if (res.Changed) {
                    $(tagObject.element).html(tagObject.value).trigger('change');
                }
                else {
                    if (!res.Value)
                        res.Value = "";
                    $(tagObject.element).html(res.Value).trigger('change');
                }
            });
        }
    };
    TaskComponent.prototype.btnAddCommentClick = function (event, task) {
        this.handleAddingComment(event, task, 'button');
    };
    TaskComponent.prototype.txtCommentKeyUp = function (event, task) {
        if (event.keyCode == 13) {
            this.handleAddingComment(event, task);
        }
    };
    TaskComponent.prototype.handleAddingComment = function (event, task, type) {
        if (type === void 0) { type = null; }
        var self = this;
        var comment = $(event.target).parents('.base-comment-item').find('textarea').val();
        var data = {
            SqlId: task.Soid,
            Content: comment
        };
        if (type == 'button') {
            if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
                return;
            }
            $(event.target).addClass('btn-loading');
        }
        self._baseService.postBase('api/Task/' + task.Soid + '/AddTaskComment', data).then(function (res) {
            if (res && res.Soid) {
                task.Comments = res.Comments;
                $(event.target).parents('.base-comment-item').find('textarea').val('');
            }
            if (type == 'button') {
                $(event.target).removeClass('btn-loading');
            }
        });
    };
    TaskComponent.prototype.btnNotifyUserClick = function (task) {
        this.notifyingObject = task;
        $("#modalTaskNotifyUser").modal('show');
    };
    TaskComponent.prototype.btnProcessNotifyUserClick = function (event, task) {
        var self = this;
        var url;
        if (self.notifyUser != "") {
            url = 'api/Task/' + self.notifyingObject.Soid + '/NotifyUser/' + self.notifyUser;
        }
        else {
            url = 'api/Task/' + self.notifyingObject.Soid + '/NotifyAll';
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase(url, {}).then(function (res) {
            if (!(res && res.ok == false)) {
                window.showSuccess('Notified!');
                $("#modalTaskNotifyUser").modal('hide');
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    TaskComponent.prototype.btnUpdateCommentClick = function (task, comment, event) {
        var self = this;
        var url = 'api/Task/' + task.Soid + '/UpdateTaskComment/' + comment.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var data = {
            FieldName: 'Content',
            Data: comment.Content
        };
        self._baseService.patchBase(url, data).then(function (res) {
            if (res && res.Changed) {
            }
            else {
                comment.Content = res.Value;
            }
            comment.isEditing = false;
            $(event.target).removeClass('btn-loading');
        });
    };
    TaskComponent.prototype.btnDeleteCommentClick = function (task, comment, index) {
        this.deletingTaskObject = task;
        this.deletingCommentObject = comment;
        this.deletingTaskObjectIndex = index;
        this.deletingType = 'comment';
        $("#confirmation_modal").modal('show');
    };
    TaskComponent.prototype.btnRemoveTaskClick = function (task, index) {
        this.deletingTaskObject = task;
        this.deletingTaskObjectIndex = index;
        this.deletingType = 'task';
        $("#confirmation_modal").modal('show');
    };
    TaskComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url;
        if (self.deletingType == 'comment') {
            url = 'api/Task/' + self.deletingTaskObject.Soid + '/DeleteTaskComment/' + self.deletingCommentObject.Soid;
        }
        else {
            url = 'api/Task/' + self.deletingTaskObject.Soid;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                if (self.deletingType == 'comment') {
                    if (res.Comments)
                        self.tasks[self.deletingTaskObjectIndex].Comments = res.Comments;
                }
                else {
                    self.tasks.splice(self.deletingTaskObjectIndex, 1);
                }
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    TaskComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    TaskComponent.prototype.btnAddTaskClick = function () {
        this.initNewTask();
        $("#modalAddTask").modal('show');
    };
    TaskComponent.prototype.initNewTask = function () {
        this.newTask = {
            Subject: '',
            Description: '',
            AssigneeSoid: '',
            Priority: '2',
            DueOn: window.getDateInputFormat(new Date()),
            Status: 'Open'
        };
    };
    TaskComponent.prototype.btnSaveTaskClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddTask");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Task', self.newTask).then(function (res) {
            if (res && res.Soid) {
                res.DueOn = window.getDateInputFormat(res.DueOn);
                self.tasks.push(res);
                self.initScrollBar();
                $("#modalAddTask").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    TaskComponent.prototype.btnAttachmentFileClick = function (i) {
        $("#taskFileInput" + i).click();
    };
    TaskComponent.prototype.onFileChange = function (event, task, i) {
        var self = this;
        var files = event.target.files;
        if (files && files[0]) {
            var formData = new FormData($('#frmTaskAttachment' + i)[0]);
            formData.append("CreatedBy", self.userInfo.userInfo.UserName);
            formData.append("CreatedID", self.userInfo.userInfo.UserSoid);
            formData.append("TaskSoid", task.Soid);
            formData.append("Subject", task.Subject);
            var url = 'api/Task/' + task.Soid + '/AddTaskAttachment';
            $("#btnAttachFile" + i).addClass('btn-loading');
            self._baseService.postBase(url, formData, false, true).then(function (res) {
                $("#btnAttachFile" + i).removeClass('btn-loading');
                if (res && res.Attachments) {
                    task.Attachments = res.Attachments;
                    self.prepareTaskData(task, 'attachment');
                }
            });
        }
    };
    TaskComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
        var self = this;
        var value = '';
        var boolInputFields = [];
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
        var url = 'api/Task/' + editingObject.Soid;
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
                if (fieldName == 'DueOn' && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return TaskComponent;
}());
TaskComponent = __decorate([
    core_1.Component({
        selector: 'task-component',
        templateUrl: './task.component.html',
        styleUrls: ['./task.component.scss', '../../share/css/base-comment.scss', '../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], TaskComponent);
exports.TaskComponent = TaskComponent;
//# sourceMappingURL=task.component.js.map