import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'ticket-component',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../share/css/base-comment.scss', '../../share/css/base-panel.scss']
})

export class TicketComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  tickets:any = [];
  users:any = [];
  offices:any = [];
  deletingTicketObject:any;
  deletingCommentObject:any;
  deletingType:any;
  deletingTicketObjectIndex:any;
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
  newTicket:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.tickets = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/ticket').then((res:any) => {
        if (res && res.ok != false) {
          self.tickets = res;
          $.each(self.tickets, function(idx, ticket){
            self.prepareTicketValues(ticket);
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

  prepareTicketValues(ticket, type:any = undefined) {
    var self = this;

    if (ticket.NextStepOn) {
      ticket.NextStepOn = window.getDateInputFormat(ticket.NextStepOn);
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  saveTags(tagObject) {
    var self = this;
    if (tagObject) {
      var TicketId = $(tagObject.element).attr("id").split('Tags')[1];
      var url = 'api/ticket/' + TicketId;
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

  btnAddCommentClick(event, ticket) {
    this.handleAddingComment(event, ticket, 'button');
  }

  txtCommentKeyUp(event, ticket) {
    if (event.keyCode == 13) {
      this.handleAddingComment(event, ticket);
    }
  }

  handleAddingComment(event, ticket, type:any = null) {
    var self = this;
    var comment:any = $(event.target).parents('.base-comment-item').find('textarea').val();
    var data:any = {
      SqlId: ticket.Soid,
      Comment: comment
    };
    if (type == 'button') {
      if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
        return;
      }
      $(event.target).addClass('btn-loading');
    }
    self._baseService.postBase('api/Ticket/' + ticket.Soid +'/AddTicketComment', data).then((res)=>{
      if (res && res.Soid) {
        ticket.Comments = res.Comments;
        $(event.target).parents('.base-comment-item').find('textarea').val('');
      }
      if (type == 'button') {
        $(event.target).removeClass('btn-loading');
      }
    });
  }

  btnUpdateCommentClick(ticket, comment, event) {
    var self = this;
    var url:any = 'api/Ticket/' + ticket.Soid + '/UpdateTicketComment/' + comment.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var data = {
      FieldName: 'Comment',
      Data: comment.Comment
    };
    self._baseService.patchBase(url, data).then((res)=>{
      if (res && res.Changed) {

      } else {
        comment.Comment = res.Value;
      }
      comment.isEditing = false;
      $(event.target).removeClass('btn-loading');
    });
  }

  btnDeleteCommentClick(ticket, comment, index) {
    this.deletingTicketObject = ticket;
    this.deletingCommentObject = comment;
    this.deletingTicketObjectIndex = index;
    this.deletingType = 'comment';
    $("#confirmation_modal").modal('show');
  }

  btnRemoveTicketClick(ticket, index) {
    this.deletingTicketObject = ticket;
    this.deletingTicketObjectIndex = index;
    this.deletingType = 'ticket';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    var url:any;
    if (self.deletingType == 'comment') {
      url = 'api/Ticket/' + self.deletingTicketObject.Soid + '/DeleteTicketComment/' + self.deletingCommentObject.Soid;
    } else {
      url = 'api/Ticket/' + self.deletingTicketObject.Soid;
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
            self.tickets[self.deletingTicketObjectIndex].Comments = res.Comments;
        } else {
          self.tickets.splice(self.deletingTicketObjectIndex, 1);
        }
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddTicketClick() {
    this.initNewTicket();
    $("#modalAddTicket").modal('show');
  }

  initNewTicket() {
    this.newTicket = {
      Subject: '',
      Description: '',
      AssigneeSoid: '',
      Priority: '2',
      Status: 'Open'
    };
  }

  btnSaveTicketClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddTicket");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Ticket', self.newTicket).then((res:any) => {
      if (res && res.Soid) {
        res.DueOn = window.getDateInputFormat(res.DueOn);
        self.tickets.push(res);
        self.initScrollBar();
        $("#modalAddTicket").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
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

    var url = 'api/Ticket/' + editingObject.Soid;
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
