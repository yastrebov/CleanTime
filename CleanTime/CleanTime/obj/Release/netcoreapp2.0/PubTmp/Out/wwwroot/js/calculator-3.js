// $(function () {
//     $('#datetimepicker6').datetimepicker(
//     {
//         language: 'ru',
//         pickTime: false
//     }).on('dp.change', function (e) {
//         $('[name="cleaning_date"]').val(e.date.format('YYYY-MM-DD'));
//         $('#cleaning_date').text(e.date.format('DD.MM.YYYY'));
//     });
// });


$(document).ready(function () {
    // Доработать что бы влияло только на цену за квартиру
    var discounts = {
        'once': 1.0,
        'once_month': 0.9,
        'twice_month': 0.85,
        'four_month': 0.80
    };

    //Считаем цены за квадратные метры в зависимости от типа помещения
    var cleaning_area_price = {
        house: {
            'supporting': 50,
            'after_construction': 110,
            'general': 90
        },
        office: {
            'supporting': 35,
            'general': 90,
            'after_construction': 110
        }
    };


    var health_type = {
        'none': 0,
        'healthy_baby': 0.4,
        'healthy_pet': 0.4
    };

    // Инициализация типа жамкаем самые первые переменные
    $('.js-discount-single').trigger('click');
    var buildType = $('.area').data('buildType','house').data('buildType');
    var cleaningType = $('.area').data('cleaningType','supporting').data('cleaningType');
    type_rooms();
    $('.js-add_comment').show();

    $('.js-cleaning-type__evet-change[checked=checked]').trigger('click');

    /**
     * Выбираем тип помещения...
     * должны сбрасываться остальные настройки
     */
    $('.js-type__event-change').on('change', function(){

        var val = $(this).val()
        $('.js-input-space__type').val(val);
        $('.js-types').hide();

        if(val == 'flat'){
            cleaningType =  $('.area').data('cleaningType');
            if(cleaningType == 'supporting'){
                //console.log(true);
                type_rooms();
            }
            else{
                //console.log(false);
                type_area();
            }

            $('.area').data('buildType','house');
            $('.js-title-what').text('квартиры');
            calculate();
        }

        if(val == 'office'){
            $('.js-title-what').text('офиса');
            $('.area').data('buildType','office');
            type_area();
        }

        if(val == 'other'){
            $('.js-title-what').text('дома');
            $('.area').data('buildType','house');
            type_area();
        }

    });


    $('.js-health__event-change').on('change', function(){

        calculate();
    });


    /**
     * Перебираем количество квартир
     */
    $('.js-flat__event-change').on('change', function(){
        roomsCount = $(this).val();
        $('.js-rooms-count').text(roomsCount);

        $('.js-rooms').removeClass('active');
        $('.js-rooms').find('input').each(function(){
            $(this).attr({"value":""});
        });

        $('.rooms').find('input').val(roomsCount);
        $('.room' + roomsCount).addClass('active');

        $('.option.room' + roomsCount + '.active').attr('value', 1);
        $('.option.room' + roomsCount + ' input').val(1);
    });

    /**
     * Перебираем количество санузлов
     */
    $('.js-bathrooms__event-change').on('change', function(){
        bathCount = $(this).val();
        $('.js-bathrooms-count').text(bathCount);
        $('.option.bathrooms').attr('value', bathCount);
        $('.option.bathrooms input').val(bathCount);
    });

    /**
     * Рассчет по количесту метров
     */
    $('.js-area__event-change').on('change keyup', function(){
        areaCount = $(this).val();
        $('.area').addClass('active');
        $('.area').val(areaCount);
        $('.area').attr('value' , areaCount);
        $('.js-area_input').attr('value', areaCount);
        $('.js-area-count').text(areaCount);
        calculate();
    });

    /**
     * Так как для метража офисов и помещений
     * @type {{supporting: {house: number, office: number}, general: number}}
     */


    /**
     * Рассчет по типу уборки
     */
    $('.js-cleaning-type__evet-change').on('click', function(){
        var cleaningType = $(this).val();
        $('.js-add_comment').hide();
        $('.js-add_option').show();
        switch(cleaningType)
        {
            case 'supporting':
                $('.area').data('cleaningType','supporting');
                space_type = $('.js-space-type').val();

                if(space_type == 'flat')
                {
                    type_rooms();
                    discount_unblocking();
                }
                $('.js-add_option').show();
                $('.js-add_comment').show();
                health_unblocking();
            break;

            case 'general':
                $('.area').data('cleaningType','general');
                type_area();
                discout_blocking();
                $('.js-add_option').show();
                $('.js-add_comment').show();
                health_unblocking();
            break;

            case 'after_construction':
                $('.area').data('cleaningType','after_construction');
                type_area();
                discout_blocking();
                $('.js-add_option').show();
                $('.js-add_comment').show();
                health_blocking();
            break;
        }
    });


    function health_blocking(){
        $('.js-health').val('none');
        $('.js-health_block').hide();
    }

    function health_unblocking(){
        $('.js-health_block').show();
    }

    function add_option_blocking(){
        $('.js-add_option').hide();
        $('.js-add_comment').show();

        //Обнуляем параметры калькулятора
        $('.js-nobase').each(function(){
            $(this).removeClass('active');
            $(this).find('input').attr('value', 0);
            $(this).find('.dec-and-inc').hide();
            $(this).val(0);
        });
        calculate();

    }

    /**
     * Отменяем возможность ежедневного заказа
     */
    function discout_blocking(){
        var discount_blocking = true
        $('.js-discount').hide();
        $('.js-discount-single').trigger('click');
    }

    function discount_unblocking(){
        var discount_blocking = false
        $('.js-discount').show();
        $('.js-discount-single').trigger('click');
    }

    /**
     * Указываем тип расчета
     * расчет по комнатам
     */
    function type_rooms(){
        $('.js-flat').show();
        // assign 1 for room counter and bathroom counter
        $('.js-flat').find('input').each(function(){
            $(this).val(1);
        });

        $('.js-rooms-counter').show();

        $('.option.js-rooms').removeClass('active');
        $('.option.room1').addClass('active');
        $('.option.room1.active').attr('value', 1);
        $('.option.room1 input').val(1);


        $('.option.bathrooms').addClass('active');
        $('.option.bathrooms.active').attr('value', 1);
        $('.option.bathrooms input').val(1);

        type_area_close();
    }

    /**
     * Обнуляем переменные для рассчета по метрам
     */
    function type_rooms_close() {
        $('.js-flat').hide();
        $('.js-flat input').val(0);

        $('.js-rooms-counter').hide();


        //Обнуляем значение комнат - @todo проверить на Баги
        $('.option.js-rooms').attr('value', 0);
        $('.option.js-rooms').find('input').val(0);
        $('.option.js-rooms').removeClass('active');

        //Обнуляем значения для ванн
        $('.option.bathrooms').attr('value', 0);
        $('.option.bathrooms').find('input').val(0);
        $('.option.bathrooms').removeClass('active');
        calculate();
    }

    /**
     * Указывам тип расчет количеству комнат и сан узлов
     */
    function type_area(){
        $('.js-area').show();
        $('.js-area').data('type_area', 'on');
        var input_val =$('.js-area').find('input').val();
        $('.js-area-counter').show();
        /**
         * Обнуляем значения пользователя если была переключена вкладка и значение обновилось
         */
        if(input_val < 1){
            $('.js-area').find('input').val(0);
            $('.option.area').attr('value', 0);
            $('.option.area').find('input').attr('value', 0);
        }

        $('.option.area').addClass('active');
        type_rooms_close();
    }

    function type_area_close() {
        $('.js-area').hide();
        $('.js-area').data('type_area', 'off');
        $('.js-area input').val(0);

        $('.js-area-counter').hide();
        $('.js-area-count').text(0);
        //Обнуляем параметры что бы больше данных не подтягивалось
        $('.option.area').attr('value', 0);
        $('.option.area').find('input').val(0);
        $('.option.area').removeClass('active');
        calculate();
    }



    // address

    $('#input-address').on('focus', function() {
        $.fancybox({
            fitToView: false,
            margin: 0,
            padding: 0,
            type: 'inline',
            content: $('.form-order-step2-address').parent().eq(0),
            wrapCSS: 'popup-style1'
        });
        return false;
    });

    $('#address').on('submit', function() {
        var address_target = $('#address-target');
        var input = $('#input-address');
        var address = [];

        input.val('');
        $(this).find('input, select').each(function(){
            address_target.find('input[name="'+$(this).attr('name')+'"]').val($(this).val());

            if(['order[street]', 'order[house]', 'order[apartment]'].indexOf($(this).attr('name')) != -1) {
                address.push($(this).val());
            }
        });
        input.val( address.join(', ') );
        $.fancybox.close();
        return false;
    });

    // date

    var locale = {
        days		: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
        daysShort	: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        daysMin		: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
        months		: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthsShort	: ['Янв', 'Фев', 'Мрт', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Нбр', 'Дек']
    };
    var dateMin = new Date();

    $('.input-date').pickmeup({
        format: 'Y-m-d',
        default_date: dateMin,
        min: dateMin,
        hide_on_select: true,
        position: 'bottom',
        prev: '«',
        next: '»',
        locale: locale,
        change: function (e) {
            $('#cleaning_date').text(e);
        }
    });


    $('#cleaning_time').text($('select[name="order[cleaning_time]"]').val());
    $('select[name="order[cleaning_time]"]').change(function () {
        $('#cleaning_time').text($(this).val())
    });

    $('#frequency').text($('label[for="'+$('input[name="order[frequency]"]:checked').attr('id')+'"]').text());
    $('input[name="order[frequency]"]').change(function (e) {
        $('#frequency').text($('label[for="'+$(this).attr('id')+'"]').text());
        calculate();
    });

    function calculate() {

        var base_price = 0;
        var duration = 0;
        var additionally = [];

        buildType =  $('.area').data('buildType');
        cleaningType =  $('.area').data('cleaningType');

        areaPrice = cleaning_area_price[buildType][cleaningType];
        $('.js-area_cleaning_price').val(areaPrice);
        //console.log(buildType, cleaningType, 'calculate');

        $('div.option.js-area_option.active').each(function(index){
            var value = $(this).val();
            base_price += parseFloat(areaPrice)*value;
        })


        //Делаем рассчет цены только для базовых полей
        $("div.option.js-base.active").each(function (index) {
            var title = $(this).find('.name').text();
            var value = parseInt($(this).attr('value'));
            //console.log(this, value);
            if(title) {
                additionally.push((value>1?value+' ':'') + title);
            }
            base_price += parseFloat($(this).attr('price'))*value;
            duration += parseFloat($(this).attr('duration'))*value;
        });


        //Считаем скидку за часы
        var frequency = $("input[type='radio'][name^='order[frequency]']:checked").val();
        base_price = base_price*discounts[frequency];

        var area = $('.js-area').data('type_area');
	cleaningTypez = $('.area').data('cleaningType');

	if((area == 'on')&&(base_price < 4500))
	{
            if(cleaningTypez == 'general')
            {
                base_price = Math.round(4500);
            }    
	}

	if((area == 'on')&&(base_price < 5500))
	{
            if(cleaningTypez == 'after_construction')
            {
                base_price = Math.round(5500);
            }
	}

        //Делаем расчет цены только по дополнительным параметрам
        $("div.option.js-nobase.active").each(function (index) {
            var title = $(this).find('.name').text();
            var value = parseInt($(this).attr('value'));

            if(title) {
                additionally.push((value>1?value+' ':'') + title);
            }

            base_price += parseFloat($(this).attr('price'))*value;

            duration += parseFloat($(this).attr('duration'))*value;
        });

        // apply discounts

        if(area == 'on')
        {
            cleaningType = $('.area').data('cleaningType');
            //console.log(cleaningType);
            if(cleaningType == 'after_construction')
            {
                duration = 400;
            }
            else{

                duration = 300;
            }
        }

        // Добавочная стоимость по здоровью
        var health_type_value = $('.js-health').val();
        if (health_type_value != 'none') {
            base_price +=  Math.round(base_price * health_type[health_type_value]);
        }

        setPrice(Math.round(base_price*100)/100);

        $('#duration').text(Math.round(duration / 60));
        $('#additionally').text(additionally.join(', '));
    }

    $('div.option').bind('cssClassChanged', function(){
        $('input[name="'+$(this).attr('name')+'"]').val($(this).hasClass('active') ? 1+$(this).data('after') : 0);
        calculate();
    });


    $('.dec-and-inc span').on('click', function() {

        var type = $(this).hasClass('dec') ? 'dec' : 'inc';

        var input = $(this).parent().find('input');
        var dataMax = $(this).parent().find('input').data('max');
        var dataMax = (dataMax)? dataMax : 100;
        var checkbox = $($(this).parents('.option'));
        var afet = input.attr('data-after') ? input.attr('data-after') : '';
        var val = parseInt(input.val());
        var newVal = (type === 'dec') ? val - 1 : val + 1;

        if (type == 'dec')
        {
            if (newVal > 0)
            {
                input.val(newVal + afet).trigger('change');
                checkbox.attr("value", newVal)
            }
        }
        else if (type == 'inc')
        {
            if (newVal <= dataMax) {
                input.val(newVal + afet).trigger('change');
                checkbox.attr("value", newVal);
            }
        }

        calculate();

        return false;
    });


    function setPrice (value) {
        $('.your_price').text(value);
    }
});