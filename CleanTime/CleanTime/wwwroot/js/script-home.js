// ------------------------------------------------------------------------

$(function () { // DOM ready

    $("[data-words]").attr("data-words", function (i, d) {
        var $self = $(this),
            $words = d.split("|"),
            tot = $words.length,
            c = 0;

        // CREATE SPANS INSIDE SPAN
        for (var i = 0; i < tot; i++) $self.append($('<span/>', { text: $words[i] }));

        // COLLECT WORDS AND HIDE
        $words = $self.find("span").hide();

        // ANIMATE AND LOOP
        (function loop() {
            $self.animate({ width: $words.eq(c).width() });
            $words.stop().fadeOut().eq(c).fadeIn().delay(3000).show(0, loop);
            c = ++c % tot;
        }());

    });

});

// ------------------------------------------------------------------------

$(init_page1_video);
function init_page1_video() {
    if ($('body.is-mobile').length)
        return;

    $(window).on('resize', function () {
        var h = $(window).height() - 76;
        $('#page1-block1').height(h);
    });
    $(window).trigger('resize');

    var video_id = $('#page1-block1').attr('data-video-id');
    $('#page1-block1').YTPlayer({
        fitToBackground: true,
        videoId: video_id,
    });
}

// ------------------------------------------------------------------------

$(init_page1_background_slider);
function init_page1_background_slider() {
    var images = $('#page1-block5').attr('data-images').split(',')
    $('#page1-block5').backstretch(images, { duration: 4000, fade: 750 });
}

// ------------------------------------------------------------------------

$(init_page1_carousel);
function init_page1_carousel() {
    $('.page1-carousel1 .items').owlCarousel({
        itemsCustom: [[0, 1], [740, 2], [980, 3]],
        navigation: true,
    });

    $('.page1-carousel2 .items').owlCarousel({
        itemsCustom: [[0, 1], [500, 2], [740, 3], [980, 4]],
        navigation: true,
    });
}

// ------------------------------------------------------------------------

$(init_page1_steps);
function init_page1_steps() {
    $('#page1-block4 ul li p').each(function () {
        $('#page1-block4 .desc').append($(this).clone());
    });

    $('#page1-block4 ul li span').on('click', function () {
        var i = $(this).closest('li').index();
        $('#page1-block4 ul li span').removeClass('active');
        $(this).addClass('active');
        $('#page1-block4 .desc p').hide();
        $('#page1-block4 .desc p').eq(i).show();
        return false;
    });

    $('#page1-block4 ul li span').eq(0).trigger('click');
}

// ------------------------------------------------------------------------