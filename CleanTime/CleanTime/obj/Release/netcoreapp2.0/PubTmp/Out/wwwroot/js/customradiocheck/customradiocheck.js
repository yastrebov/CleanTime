/*
 * customRadioCheck: jQuery plguin for checkbox and radio replacement
 * Usage: $('input[type=checkbox], input[type=radio]').customRadioCheck();
 * Author: Cedric Ruiz
 * License: MIT
 * Modified by OLEG 2014-09-17 21:00:00
*/
(function () {
    $.fn.customRadioCheck = function () {

        return this.each(function () {

            var $this = $(this);
            var $span = $('<span/>');

            $span.addClass('custom-' + ($this.is(':checkbox') ? 'check' : 'radio'));
            $this.is(':checked') && $span.addClass('checked');
            $this.is(':disabled') && $span.addClass('disabled');
            $span.attr('data-name', $this.attr('name'));
            $span.insertAfter($this);
            $this.css({ position: 'absolute', left: '-9999px' });
            $this.parent('label').addClass('custom-label').attr('onclick', ''); // Fix clicking label in iOS

            // events
            $this.on({
                change: function () {
                    if ($this.is(':radio')) {
                        $this.closest('form').find('.custom-radio[data-name="' + $this.attr('name') + '"]').
                            removeClass('checked');
                    }
                    $span.toggleClass('checked', $this.is(':checked'));
                },
                focus: function () { $span.addClass('focus'); },
                blur: function () { $span.removeClass('focus'); }
            });
        });
    };
}());