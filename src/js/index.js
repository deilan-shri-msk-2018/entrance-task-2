$(window).scroll(function (e) {
    $('.schedule__day-timeline').css("left", -$(window).scrollLeft())
});

$(document).ready(function () {
    resizeSchedule();
    $(window).resize(function (evt) {
        resizeSchedule(evt);
    });

    $(".avaiable-room__close").click(function(evt) {
        var roomEl = evt.target.closest('.available-room');
        roomEl.classList.remove('available-room--active');
        $(".available-room--hidden").removeClass('available-room--hidden');
    });

    $(".available-room").click(function(evt) {
        if(evt.target.classList.contains('avaiable-room__close')) {
            return;
        }
        $(".available-room").not(this).addClass('available-room--hidden');
        this.classList.add('available-room--active');
    });

    $(".schedule").click(function (evt) {
        $('.timeline__item--active').removeClass('timeline__item--active');
        var target = evt.target;
        if (!target.classList.contains('meeting')) {
            return;
        }
        $(target).toggleClass('timeline__item--active');
        var halfTargetWidth = $(target).width() / 2;
        $(target).find('.timeline__meeting').css('margin-left', halfTargetWidth);
    });

    $(".schedule").click(function (evt) {
        var target = evt.target;
        if (target.classList.contains('schedule__slider-date')) {
            $('.schedule__calendar').addClass('schedule__calendar--active');
            return;
        }
        if (target.classList.contains('schedule__calendar') || target.classList.contains('schedule__calendar-inner')) {
            return;
        }
        $('.schedule__calendar--active').removeClass('schedule__calendar--active')
    });
});

function resizeSchedule(evt) {
    var timelineWidth = getTimelineWidth();
    var windowWidth = $(window).width();
    var resultWidth = timelineWidth > windowWidth ? timelineWidth : "100%";
    $(".schedule").css("width", resultWidth);
}

function getTimelineWidth() {
    var spacing = getSpacing($(".schedule__day-timeline"));
    return spacing + $(".day-timeline__list").outerWidth(true);
}

function getSpacing(el) {
    return el.outerWidth(true) - el.outerWidth(false);
}