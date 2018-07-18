var initScrollBar, getDateInputFormat, getDateTimeInputFormat, getTimeInputFormat, delay, showError, showSuccess, validateEmail, validateForm;
(function() {
    initScrollBar = function() {
      var isMobile = window.innerWidth > 767;
      $(".custom-scroll").mCustomScrollbar({
        theme: 'minimal-dark',
        scrollInertia: 120,
        swipeBubblingAllowed: isMobile,
        callbacks: {
            onUpdate: function(){
                if ($(".custom-scroll").css('opacity') == 0) {
                    $(".custom-scroll").fadeTo('fast', 1);
                }
            }
        }
      });
    },
    validateEmail = function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    },
    validateForm = function(event, formId) {
      var inputs = $("#" + formId + " .require-field");
      var invalid = false;
      $.each(inputs, function(idx, input){
        if (!$(input).val() || $(input).val().trim() == "" || ($(input).attr('type') == 'email' && !window.validateEmail($(input).val().trim()))) {
          $(input).parents('.input-wrapper').addClass('has-error');
          invalid = true;
          $(input).bind('keyup', function(event){
            $(event.target).parents('.input-wrapper').removeClass('has-error');
          }).bind('change', function(event){
            $(event.target).parents('.input-wrapper').removeClass('has-error');
          });
        }
      });

      return invalid;
    },
    getDateInputFormat = function(strDate) {
      if (!strDate)
        return '';

      if (isNaN(Date.parse(strDate)))
        return strDate;

      var d = new Date(strDate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' + d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      var yearLength = year.length;
      if (yearLength < 4) {
        for (var i = 0; i < (4-yearLength); i++) {
          year = '0' + year;
        }
      }

      return [year, month, day].join('-');
    },
    getDateTimeInputFormat = function(strDate) {
      if (!strDate)
        return '';

      if (isNaN(Date.parse(strDate)))
        return strDate;

      var d = new Date(strDate),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = '' + d.getFullYear();
        hours = '' + d.getHours();
        minutes = '' + d.getMinutes();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      if (hours.length < 2) hours = '0' + hours;
      if (minutes.length < 2) minutes = '0' + minutes;

      var yearLength = year.length;
      if (yearLength < 4) {
        for (var i = 0; i < (4-yearLength); i++) {
          year = '0' + year;
        }
      }
      var dateFormatted = [year, month, day].join('-');
      return dateFormatted + 'T' + hours + ':' + minutes;
    },
    getTimeInputFormat = function(strDate) {
      if (!strDate)
        return '';

      if (isNaN(Date.parse(strDate)))
        return strDate;

      var d = new Date(strDate),
        hours = '' + d.getHours();
        minutes = '' + d.getMinutes();

      if (hours.length < 2) hours = '0' + hours;
      if (minutes.length < 2) minutes = '0' + minutes;

      var timeFormatted = [hours, minutes].join(':');
      return timeFormatted;
    },
    showError = function(message) {
      if (!message) {
        message = 'An error has occurred. Please try again!';
      }
      $.notify({
        title: "<b>Error</b>",
        message: message
      },{
        type: 'danger',
        allow_dismiss: true
      });
    },
    showSuccess = function(message) {
      $.notify({
        title: "<b>SUCCESS</b>",
        message: message
      },{
        type: 'success',
        allow_dismiss: true
      });
    }

})();
