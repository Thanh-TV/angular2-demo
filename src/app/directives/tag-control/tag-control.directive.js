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
var TagControlDirective = (function () {
    function TagControlDirective(elementRef) {
        this.elementRef = elementRef;
        this.saveTags = new core_1.EventEmitter();
        this.el = this.elementRef.nativeElement;
    }
    TagControlDirective.prototype.ngOnInit = function () {
        var self = this;
        setTimeout(function () {
            self.initValue();
            $(self.el).bind('change', function () {
                if ($(self.el).html().indexOf('span') >= 0) {
                    return;
                }
                self.initValue();
            });
        }, 500);
    };
    TagControlDirective.prototype.initValue = function () {
        var self = this;
        var value = $(self.el).html();
        var tags = value.split(',');
        var newHtml = '';
        var hasTag = false;
        for (var i = 0; i < tags.length; i++) {
            if (tags[i]) {
                newHtml += '<span class="tag-item">' + tags[i] + '<i class="material-icons">clear</i></span>';
                hasTag = true;
            }
        }
        if (!hasTag) {
            newHtml += '<span></span>';
        }
        newHtml += '<input type="text" class="tag-input" placeholder="Add Tag"/>';
        $(self.el).html(newHtml);
        $(self.el).find("i").bind('click', function (event) {
            $(event.target).closest('span.tag-item').remove();
            var value = self.getTagValues();
            self.handleSavingTags(value);
        });
        $(self.el).find("input").bind('keyup', function (event) {
            if (event.keyCode == 13) {
                self.handleAddingTag(event);
            }
        });
        $(self.el).find("input").bind('blur', function (event) {
            self.handleAddingTag(event);
        });
    };
    TagControlDirective.prototype.handleAddingTag = function (event) {
        var self = this;
        if ($(event.target).val().trim() != "") {
            var value = self.getTagValues();
            value += "," + $(event.target).val().trim();
            self.handleSavingTags(value);
        }
    };
    TagControlDirective.prototype.getTagValues = function () {
        var strValue = "";
        var spans = $(this.el).find("span");
        for (var i = 0; i < spans.length; i++) {
            if (spans[i]) {
                var spanHtml = $(spans[i]).html().trim();
                var spanHtmlArr = spanHtml.split('<i');
                if (spanHtmlArr.length > 0)
                    strValue += spanHtmlArr[0] + ',';
            }
        }
        if (strValue.length > 0 && strValue[strValue.length - 1] == ',') {
            strValue = strValue.substring(0, strValue.length - 1);
        }
        return strValue;
    };
    TagControlDirective.prototype.handleSavingTags = function (value) {
        var tagObject = {
            element: this.el,
            value: value
        };
        this.saveTags.emit(tagObject);
    };
    return TagControlDirective;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", core_1.EventEmitter)
], TagControlDirective.prototype, "saveTags", void 0);
TagControlDirective = __decorate([
    core_1.Directive({ selector: "[tagControl]" }),
    __metadata("design:paramtypes", [core_1.ElementRef])
], TagControlDirective);
exports.TagControlDirective = TagControlDirective;
//# sourceMappingURL=tag-control.directive.js.map