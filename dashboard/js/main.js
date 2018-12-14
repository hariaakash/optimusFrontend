function load(script) {
    document.write('<' + 'script src="' + script + '" type="text/javascript"><' + '/script>');
}

load("https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.min.js");
load("https://cdnjs.cloudflare.com/ajax/libs/angular-ui-router/1.0.3/angular-ui-router.min.js");
load("https://cdnjs.cloudflare.com/ajax/libs/oclazyload/1.0.1/ocLazyLoad.min.js");
load("https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js");
load("https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.slim.js");
load("./js/app.js");
load("https://cdnjs.cloudflare.com/ajax/libs/angular-loading-bar/0.9.0/loading-bar.min.js");
$(document).ready(function () {
    // Theme settings
    //Loads the correct sidebar on window load,
    //collapses the sidebar on window resize.
    // Sets the min-height of #page-wrapper to window size
    $(function () {
        $(window).bind("load resize", function () {
            topOffset = 60;
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 768) {
                $('div.navbar-collapse').addClass('collapse');
                topOffset = 100; // 2-row-menu
            } else {
                $('div.navbar-collapse').removeClass('collapse');
            }
            height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
            height = height - topOffset;
            if (height < 1) height = 1;
            if (height > topOffset) {
                $("#page-wrapper").css("min-height", (height) + "px");
            }
        });
        var url = window.location;
        var element = $('ul.nav a').filter(function () {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });
    //tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    //Popover
    $(function () {
        $('[data-toggle="popover"]').popover()
    })
});
//Colepsible toggle
$(".collapseble").click(function () {
    $(".collapseblebox").fadeToggle(350);
});
// Resize all elements
$("body").trigger("resize");
// visited ul li
$('.visited li a').click(function (e) {
    $('.visited li').removeClass('active');
    var $parent = $(this).parent();
    if (!$parent.hasClass('active')) {
        $parent.addClass('active');
    }
    e.preventDefault();
});