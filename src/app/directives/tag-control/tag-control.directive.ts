import { Directive, HostListener, ElementRef, OnInit, Output, EventEmitter } from "@angular/core";

declare var $:any;

@Directive({ selector: "[tagControl]" })
export class TagControlDirective implements OnInit {

  private el: HTMLInputElement;
  @Output() saveTags: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    var self = this;
    setTimeout(function(){
      self.initValue();
      $(self.el).bind('change', function(){
        if ($(self.el).html().indexOf('span') >= 0) {
          return;
        }
        self.initValue();
      });
    }, 500);
  }

  initValue() {
    var self = this;
    var value:any = $(self.el).html();
    var tags:any = value.split(',');
    var newHtml:any = '';
    var hasTag:any = false;
    for (var i = 0; i < tags.length; i++) {
      if (tags[i]) {
        newHtml += '<span class="tag-item">' + tags[i] +'<i class="material-icons">clear</i></span>';
        hasTag = true;
      }
    }
    if (!hasTag) {
      newHtml += '<span></span>';
    }
    newHtml += '<input type="text" class="tag-input" placeholder="Add Tag"/>';
    $(self.el).html(newHtml);
    $(self.el).find("i").bind('click', function(event) {
      $(event.target).closest('span.tag-item').remove();
      var value = self.getTagValues();
      self.handleSavingTags(value);
    });
    $(self.el).find("input").bind('keyup', function(event) {
      if (event.keyCode == 13) {
        self.handleAddingTag(event);
      }
    });
    $(self.el).find("input").bind('blur', function(event) {
      self.handleAddingTag(event);
    });
  }

  handleAddingTag(event) {
    var self = this;
    if ($(event.target).val().trim() != "") {
      var value = self.getTagValues();
      value += "," + $(event.target).val().trim();
      self.handleSavingTags(value);
    }
  }

  getTagValues() {
    var strValue = "";
    var spans:any = $(this.el).find("span");
    for (var i = 0; i < spans.length; i++) {
      if (spans[i]) {
        var spanHtml:any = $(spans[i]).html().trim();
        var spanHtmlArr = spanHtml.split('<i');
        if (spanHtmlArr.length > 0)
          strValue += spanHtmlArr[0] + ',';
      }
    }
    if (strValue.length > 0 && strValue[strValue.length - 1] == ',') {
      strValue = strValue.substring(0, strValue.length - 1);
    }
    return strValue;
  }

  handleSavingTags(value) {
    var tagObject:any = {
      element: this.el,
      value: value
    };
    this.saveTags.emit(tagObject);
  }
}
