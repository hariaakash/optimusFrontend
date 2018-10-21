function load(script) {
    document.write('<' + 'script src="' + script + '" type="text/javascript"><' + '/script>');
}

load("./js/angular.min.js");
load("./plugins/ui-router/angular-ui-router.min.js");
load("./plugins/ocLazyLoad/ocLazyLoad.min.js");
load("./plugins/js-cookie/js-cookie.min.js");
load("./js/app.js");
load("./plugins/angular-loading-bar/loading-bar.js");
$(document).ready(function() {
    // Theme settings
    //Open-Close-right sidebar
    $(".right-side-toggle").click(function() {
        $(".right-sidebar").slideDown(50);
        $(".right-sidebar").toggleClass("shw-rside");
        // Fix header
        $(".fxhdr").click(function() {
            $("body").toggleClass("fix-header");
        });
        // Fix sidebar
        $(".fxsdr").click(function() {
            $("body").toggleClass("fix-sidebar");
        });
        // Service panel js
        if ($("body").hasClass("fix-header")) {
            $('.fxhdr').attr('checked', true);
        } else {
            $('.fxhdr').attr('checked', false);
        }
        if ($("body").hasClass("fix-sidebar")) {
            $('.fxsdr').attr('checked', true);
        } else {
            $('.fxsdr').attr('checked', false);
        }
    });
    //Loads the correct sidebar on window load,
    //collapses the sidebar on window resize.
    // Sets the min-height of #page-wrapper to window size
    $(function() {
        $(window).bind("load resize", function() {
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
        var element = $('ul.nav a').filter(function() {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });
    // This is for resize window
    $(function() {
        $(window).bind("load resize", function() {
            width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
            if (width < 1170) {
                $('body').addClass('content-wrapper');
                $(".open-close i").removeClass('fa-arrow-circle-left');
                $(".sidebar-nav").css("overflow-x", "visible").parent().css("overflow", "visible");
                $(".logo span").hide();
            } else {
                $('body').removeClass('content-wrapper');
                $(".open-close i").addClass('fa-arrow-circle-left');
                $(".logo span").show();
            }
        });
    });
    //tooltip
    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })
    //Popover
    $(function() {
        $('[data-toggle="popover"]').popover()
    })
});
//Colepsible toggle
$(".collapseble").click(function() {
    $(".collapseblebox").fadeToggle(350);
});
// Resize all elements
$("body").trigger("resize");
// visited ul li
$('.visited li a').click(function(e) {
    $('.visited li').removeClass('active');
    var $parent = $(this).parent();
    if (!$parent.hasClass('active')) {
        $parent.addClass('active');
    }
    e.preventDefault();
});
