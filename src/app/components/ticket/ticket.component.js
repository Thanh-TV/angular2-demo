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
var TicketComponent = (function () {
    function TicketComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.tickets = [];
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
        this.newTicket = {};
    }
    TicketComponent.prototype.ngOnInit = function () {
        var self = this;
        self.tickets = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/ticket').then(function (res) {
                if (res && res.ok != false) {
                    self.tickets = res;
                    $.each(self.tickets, function (idx, ticket) {
                        self.prepareTicketValues(ticket);
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
    TicketComponent.prototype.prepareTicketValues = function (ticket, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if (ticket.NextStepOn) {
            ticket.NextStepOn = window.getDateInputFormat(ticket.NextStepOn);
        }
    };
    TicketComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    TicketComponent.prototype.saveTags = function (tagObject) {
        var self = this;
        if (tagObject) {
            var TicketId = $(tagObject.element).attr("id").split('Tags')[1];
            var url = 'api/ticket/' + TicketId;
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
    TicketComponent.prototype.btnAddCommentClick = function (event, ticket) {
        this.handleAddingComment(event, ticket, 'button');
    };
    TicketComponent.prototype.txtCommentKeyUp = function (event, ticket) {
        if (event.keyCode == 13) {
            this.handleAddingComment(event, ticket);
        }
    };
    TicketComponent.prototype.handleAddingComment = function (event, ticket, type) {
        if (type === void 0) { type = null; }
        var self = this;
        var comment = $(event.target).parents('.base-comment-item').find('textarea').val();
        var data = {
            SqlId: ticket.Soid,
            Comment: comment
        };
        if (type == 'button') {
            if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
                return;
            }
            $(event.target).addClass('btn-loading');
        }
        self._baseService.postBase('api/Ticket/' + ticket.Soid + '/AddTicketComment', data).then(function (res) {
            if (res && res.Soid) {
                ticket.Comments = res.Comments;
                $(event.target).parents('.base-comment-item').find('textarea').val('');
            }
            if (type == 'button') {
                $(event.target).removeClass('btn-loading');
            }
        });
    };
    TicketComponent.prototype.btnUpdateCommentClick = function (ticket, comment, event) {
        var self = this;
        var url = 'api/Ticket/' + ticket.Soid + '/UpdateTicketComment/' + comment.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var data = {
            FieldName: 'Comment',
            Data: comment.Comment
        };
        self._baseService.patchBase(url, data).then(function (res) {
            if (res && res.Changed) {
            }
            else {
                comment.Comment = res.Value;
            }
            comment.isEditing = false;
            $(event.target).removeClass('btn-loading');
        });
    };
    TicketComponent.prototype.btnDeleteCommentClick = function (ticket, comment, index) {
        this.deletingTicketObject = ticket;
        this.deletingCommentObject = comment;
        this.deletingTicketObjectIndex = index;
        this.deletingType = 'comment';
        $("#confirmation_modal").modal('show');
    };
    TicketComponent.prototype.btnRemoveTicketClick = function (ticket, index) {
        this.deletingTicketObject = ticket;
        this.deletingTicketObjectIndex = index;
        this.deletingType = 'ticket';
        $("#confirmation_modal").modal('show');
    };
    TicketComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url;
        if (self.deletingType == 'comment') {
            url = 'api/Ticket/' + self.deletingTicketObject.Soid + '/DeleteTicketComment/' + self.deletingCommentObject.Soid;
        }
        else {
            url = 'api/Ticket/' + self.deletingTicketObject.Soid;
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
                        self.tickets[self.deletingTicketObjectIndex].Comments = res.Comments;
                }
                else {
                    self.tickets.splice(self.deletingTicketObjectIndex, 1);
                }
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    TicketComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    TicketComponent.prototype.btnAddTicketClick = function () {
        this.initNewTicket();
        $("#modalAddTicket").modal('show');
    };
    TicketComponent.prototype.initNewTicket = function () {
        this.newTicket = {
            Subject: '',
            Description: '',
            AssigneeSoid: '',
            Priority: '2',
            Status: 'Open'
        };
    };
    TicketComponent.prototype.btnSaveTicketClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddTicket");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Ticket', self.newTicket).then(function (res) {
            if (res && res.Soid) {
                res.DueOn = window.getDateInputFormat(res.DueOn);
                self.tickets.push(res);
                self.initScrollBar();
                $("#modalAddTicket").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    TicketComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
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
        var url = 'api/Ticket/' + editingObject.Soid;
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
    return TicketComponent;
}());
TicketComponent = __decorate([
    core_1.Component({
        selector: 'ticket-component',
        templateUrl: './ticket.component.html',
        styleUrls: ['./ticket.component.css', '../../share/css/base-comment.scss', '../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], TicketComponent);
exports.TicketComponent = TicketComponent;
//# sourceMappingURL=ticket.component.js.map