// ------------------------------------------------------------------------

$(init_mobile);
function init_mobile() {
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent))
        $('body').addClass('is-mobile');
    else
        $('body').addClass('is-not-mobile');
}

// ------------------------------------------------------------------------

// menu
$(init_menu);
function init_menu() {
    /* header nav */

    $(document).on('click', '.header-nav span', function () {
        $(this).next().toggleClass('shown');
        return false;
    });

    $(document).on('click', function () {
        $('.header-nav .shown').removeClass('shown');
    });

    /* slidebar */

    if (typeof slidebars === 'function') {
        $('#container, #footer').wrapAll(
            $('<div canvas="container"></div>')
        );

        $('[canvas="container"]').after(
            $('<div>').attr('off-canvas', 'slidebar right shift').attr('id', 'slidebar')
        );

        var controller = new slidebars();
        controller.init();

        $(document).on('click', '.header-toggle', function () {
            controller.toggle('slidebar');
            return false;
        });

        /* slidebar content */

        var slidebar = $('#slidebar');

        $('<div>').addClass('slidebar-btn').appendTo(slidebar).append(
            $('.header-btn').children().clone()
        );

        $('<div>').addClass('slidebar-nav').appendTo(slidebar).append(
            $('.header-nav').children().clone()
        );

        $(document).on('click', '.slidebar-nav span', function () {
            $(this).next().slideToggle();
            return false;
        });
    }
}

// ------------------------------------------------------------------------

$(init_maskedinput);
function init_maskedinput() {
    $('[data-mask]').each(function () {
        var mask = $(this).attr('data-mask');
        if (mask === 'phone') mask = '+7 (999) 999-99-99';
        $(this).mask(mask);
    });
}

// ------------------------------------------------------------------------

$(init_customradiocheck);
function init_customradiocheck() {
    $('[type="checkbox"], [type="radio"]').each(function () {
        if ($(this).closest('.switcher').length === 0)
            $(this).customRadioCheck();
    });
}

// ------------------------------------------------------------------------

$(init_dec_and_inc);
function init_dec_and_inc() {
    $(document).on('click', '.dec-and-inc span', function () {

        var type = $(this).hasClass('dec') ? 'dec' : 'inc';
        var input = $(this).parent().find('input');
        var val = parseInt(input.val());
        var newVal = (type === 'dec') ? val - 1 : val + 1;
        var after = input.attr('data-after') ? input.attr('data-after') : '';

        if (type == 'dec') {
            if (newVal != 0) {
                input.val(newVal + after);
            }
        }
        else if (type == 'inc') {
            input.val(newVal + after);
        }

        return false;
    });
}

// ------------------------------------------------------------------------

$(init_review_stars);
function init_review_stars() {
    $(document).on('click', '#form-review .stars i', function () {

        var i = $(this);
        i.parent().find('i').removeClass('active');
        i.parent().find('i').slice(0, i.index() + 1).addClass('active');

        var total = i.parent().find('i.active').length;
        i.parent().find('input').val(total);

        i.closest('form').find('.hidden').slideDown();

        return false;
    });
}

// ------------------------------------------------------------------------

$(init_form_placeholders);
function init_form_placeholders() {
    $('.form-placeholder.normal').each(function () {
        if ($(this).parent().find('.form-control').val() !== '') {
            $(this).parent().find('.form-placeholder.normal').hide();
            $(this).parent().find('.form-placeholder.focused').show();
        }
    });

    $(document).on('click', '.form-placeholder', function () {
        $(this).parent().find('.form-control').trigger('focus');
    });

    $(document).on('focus', '.form-control', function () {
        $(this).parent().find('.form-placeholder.normal').fadeOut();
        $(this).parent().find('.form-placeholder.focused').fadeIn();
    });

    $(document).on('blur', '.form-control', function () {
        if ($(this).val() === '') {
            $(this).parent().find('.form-placeholder.normal').fadeIn();
            $(this).parent().find('.form-placeholder.focused').fadeOut();
        }
    });
}

// ------------------------------------------------------------------------

$(init_order);
function init_order() {
    // address
    function init_input_address() {
        if ($('.input-address').val() == '0') {
            $('#form-order-step2-address').show();
        }
        else {
            $('#form-order-step2-address').hide();
        }
        return false;
    }

    $('.input-address').on('change', function () {
        init_input_address();
    });

    init_input_address();

    // date

    var locale = {
        days: ['Р’РѕСЃРєСЂРµСЃРµРЅСЊРµ', 'РџРѕРЅРµРґРµР»СЊРЅРёРє', 'Р’С‚РѕСЂРЅРёРє', 'РЎСЂРµРґР°', 'Р§РµС‚РІРµСЂРі', 'РџСЏС‚РЅРёС†Р°', 'РЎСѓР±Р±РѕС‚Р°', 'Р’РѕСЃРєСЂРµСЃРµРЅСЊРµ'],
        daysShort: ['Р’СЃ', 'РџРЅ', 'Р’С‚', 'РЎСЂ', 'Р§С‚', 'РџС‚', 'РЎР±', 'Р’СЃ'],
        daysMin: ['Р’СЃ', 'РџРЅ', 'Р’С‚', 'РЎСЂ', 'Р§С‚', 'РџС‚', 'РЎР±', 'Р’СЃ'],
        months: ['РЇРЅРІР°СЂСЊ', 'Р¤РµРІСЂР°Р»СЊ', 'РњР°СЂС‚', 'РђРїСЂРµР»СЊ', 'РњР°Р№', 'РСЋРЅСЊ', 'РСЋР»СЊ', 'РђРІРіСѓСЃС‚', 'РЎРµРЅС‚СЏР±СЂСЊ', 'РћРєС‚СЏР±СЂСЊ', 'РќРѕСЏР±СЂСЊ', 'Р”РµРєР°Р±СЂСЊ'],
        monthsShort: ['РЇРЅРІ', 'Р¤РµРІ', 'РњСЂС‚', 'РђРїСЂ', 'РњР°Р№', 'РСЋРЅ', 'РСЋР»', 'РђРІРі', 'РЎРµРЅ', 'РћРєС‚', 'РќР±СЂ', 'Р”РµРє'],
    };
    var dateMin = new Date();

    if ($('.input-date').length)
        $('.input-date').pickmeup({
            format: 'Y-m-d',
            default_date: dateMin,
            min: dateMin,
            hide_on_select: true,
            position: 'bottom',
            prev: 'В«',
            next: 'В»',
            locale: locale,
        });

    // options

    $(document).on('click', '.block-order-step2-options .option .img', function () {
        var option = $(this).closest('.option');
        var popup = option.attr('data-popup')
        if (option.hasClass('active')) {
            option.removeClass('active');
            option.find('.dec-and-inc-outer').hide();
            option.find('input').val('');
        }
        else {
            option.addClass('active');
            option.find('.dec-and-inc-outer').show();
            if (popup) {
                $.fancybox({
                    fitToView: false,
                    margin: 0,
                    padding: 0,
                    type: 'inline',
                    content: $(popup).parent(),
                    wrapCSS: 'popup-style1',
                });
            }
        }
        option.trigger('cssClassChanged');
        return false;
    });

    $('.block-order-step2-options .option[data-popup]').each(function () {
        var option = $(this);
        var input = option.find('input');
        var popup = option.attr('data-popup');
        $(popup).on('submit', function () {
            input.val(
                $(this).find('textarea').val()
            );
            $.fancybox.close();
            return false;
        });

    });

    // faq

    $(document).on('click', '.block-faq .items .title', function () {
        $(this).next().slideToggle();
        return false;
    });
}

// ------------------------------------------------------------------------

// resizer
$(init_resizer);
function init_resizer() {
    var resizer = function () {
        // about

        if ($('.block-about-icons .item').css('float') === 'none') {
            $('.block-about-icons .title').height('auto');
            $('.block-about-icons .text').height('auto');
        }
        else {
            $('.block-about-icons .title').servsiteSameHeight();
            $('.block-about-icons .text').servsiteSameHeight();
        }

        // faq

        if ($('.block-faq-list .item').css('float') === 'none') {
            $('.block-faq-list .inner').height('auto');
        }
        else {
            $('.block-faq-list .inner').servsiteSameHeight();
        }
    }

    var timer = null;
    $(window).on('resize', function () {
        if (timer) clearTimeout(timer);
        timer = setTimeout(resizer, 500);
    });

    resizer();
}


/* servsiteSameHeight */
(function ($) {
    $.fn.servsiteSameHeight = function () {
        var max = 0;
        this.height('auto');
        this.each(function () {
            max = Math.max(max, $(this).height());
        });
        this.height(max);
        return this;
    };
})(jQuery);

// ------------------------------------------------------------------------