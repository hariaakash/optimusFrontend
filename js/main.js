    $(function () {
        'use strict';

        // --------------------------
        // Fade In on Load
        // --------------------------
        $(window).on('load', function () {
            $('.web-in').addClass('fade-in');
        });

        // ----------------------------
        // Hamburger Menu
        // ----------------------------
        $('#menu-icon').on('click', function () {
            $('body').toggleClass('menu-open').toggleClass(
                'modal-open');
        });
    });