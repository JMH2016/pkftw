/**
* jquery.matchHeight-min.js v0.6.0
* http://brm.io/jquery-match-height/
* License: MIT
*/
(function (c) {
    var n = -1, f = -1, g = function (a) { return parseFloat(a) || 0 }, r = function (a) { var b = null, d = []; c(a).each(function () { var a = c(this), k = a.offset().top - g(a.css("margin-top")), l = 0 < d.length ? d[d.length - 1] : null; null === l ? d.push(a) : 1 >= Math.floor(Math.abs(b - k)) ? d[d.length - 1] = l.add(a) : d.push(a); b = k }); return d }, p = function (a) { var b = { byRow: !0, property: "height", target: null, remove: !1 }; if ("object" === typeof a) return c.extend(b, a); "boolean" === typeof a ? b.byRow = a : "remove" === a && (b.remove = !0); return b }, b = c.fn.matchHeight =
        function (a) { a = p(a); if (a.remove) { var e = this; this.css(a.property, ""); c.each(b._groups, function (a, b) { b.elements = b.elements.not(e) }); return this } if (1 >= this.length && !a.target) return this; b._groups.push({ elements: this, options: a }); b._apply(this, a); return this }; b._groups = []; b._throttle = 80; b._maintainScroll = !1; b._beforeUpdate = null; b._afterUpdate = null; b._apply = function (a, e) {
            var d = p(e), h = c(a), k = [h], l = c(window).scrollTop(), f = c("html").outerHeight(!0), m = h.parents().filter(":hidden"); m.each(function () {
                var a = c(this);
                a.data("style-cache", a.attr("style"))
            }); m.css("display", "block"); d.byRow && !d.target && (h.each(function () { var a = c(this), b = "inline-block" === a.css("display") ? "inline-block" : "block"; a.data("style-cache", a.attr("style")); a.css({ display: b, "padding-top": "0", "padding-bottom": "0", "margin-top": "0", "margin-bottom": "0", "border-top-width": "0", "border-bottom-width": "0", height: "100px" }) }), k = r(h), h.each(function () { var a = c(this); a.attr("style", a.data("style-cache") || "") })); c.each(k, function (a, b) {
                var e = c(b), f = 0; if (d.target) f =
                    d.target.outerHeight(!1); else { if (d.byRow && 1 >= e.length) { e.css(d.property, ""); return } e.each(function () { var a = c(this), b = { display: "inline-block" === a.css("display") ? "inline-block" : "block" }; b[d.property] = ""; a.css(b); a.outerHeight(!1) > f && (f = a.outerHeight(!1)); a.css("display", "") }) } e.each(function () {
                        var a = c(this), b = 0; d.target && a.is(d.target) || ("border-box" !== a.css("box-sizing") && (b += g(a.css("border-top-width")) + g(a.css("border-bottom-width")), b += g(a.css("padding-top")) + g(a.css("padding-bottom"))), a.css(d.property,
                            f - b))
                    })
            }); m.each(function () { var a = c(this); a.attr("style", a.data("style-cache") || null) }); b._maintainScroll && c(window).scrollTop(l / f * c("html").outerHeight(!0)); return this
        }; b._applyDataApi = function () { var a = {}; c("[data-match-height], [data-mh]").each(function () { var b = c(this), d = b.attr("data-mh") || b.attr("data-match-height"); a[d] = d in a ? a[d].add(b) : b }); c.each(a, function () { this.matchHeight(!0) }) }; var q = function (a) {
            b._beforeUpdate && b._beforeUpdate(a, b._groups); c.each(b._groups, function () {
                b._apply(this.elements,
                    this.options)
            }); b._afterUpdate && b._afterUpdate(a, b._groups)
        }; b._update = function (a, e) { if (e && "resize" === e.type) { var d = c(window).width(); if (d === n) return; n = d } a ? -1 === f && (f = setTimeout(function () { q(e); f = -1 }, b._throttle)) : q(e) }; c(b._applyDataApi); c(window).bind("load", function (a) { b._update(!1, a) }); c(window).bind("resize orientationchange", function (a) { b._update(!0, a) })
})(jQuery);


/*! * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+ * http://cherne.net/brian/resources/jquery.hoverIntent.html * * You may use hoverIntent under the terms of the MIT license. Basically that * means you are free to use hoverIntent as long as this header is left intact. * Copyright 2007, 2014 Brian Cherne */ (function ($) { $.fn.hoverIntent = function (handlerIn, handlerOut, selector) { var cfg = { interval: 100, sensitivity: 6, timeout: 0 }; if (typeof handlerIn === "object") { cfg = $.extend(cfg, handlerIn) } else { if ($.isFunction(handlerOut)) { cfg = $.extend(cfg, { over: handlerIn, out: handlerOut, selector: selector }) } else { cfg = $.extend(cfg, { over: handlerIn, out: handlerIn, selector: handlerOut }) } } var cX, cY, pX, pY; var track = function (ev) { cX = ev.pageX; cY = ev.pageY }; var compare = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); if (Math.sqrt((pX - cX) * (pX - cX) + (pY - cY) * (pY - cY)) < cfg.sensitivity) { $(ob).off("mousemove.hoverIntent", track); ob.hoverIntent_s = true; return cfg.over.apply(ob, [ev]) } else { pX = cX; pY = cY; ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } }; var delay = function (ev, ob) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); ob.hoverIntent_s = false; return cfg.out.apply(ob, [ev]) }; var handleHover = function (e) { var ev = $.extend({}, e); var ob = this; if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t) } if (e.type === "mouseenter") { pX = ev.pageX; pY = ev.pageY; $(ob).on("mousemove.hoverIntent", track); if (!ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout(function () { compare(ev, ob) }, cfg.interval) } } else { $(ob).off("mousemove.hoverIntent", track); if (ob.hoverIntent_s) { ob.hoverIntent_t = setTimeout(function () { delay(ev, ob) }, cfg.timeout) } } }; return this.on({ "mouseenter.hoverIntent": handleHover, "mouseleave.hoverIntent": handleHover }, cfg.selector) } })(jQuery);

// IE8 specifics
if (!document.addEventListener) {
    var html5Tags = ['article', 'aside', 'figure', 'figcaption', 'footer', 'header', 'nav', 'section'];
    for (var i = 0, l = html5Tags.length; i < l; i++) {
        document.createElement(html5Tags[i]);
    }
}



$(function () {
});



var PKF = {

    equalizeHeight: function () {
        // $(".peopleList li").matchHeight();
        $(".similarPeopleList li").matchHeight();

    },
    getCloser: function () {
        //if ($('.getCloserPeopleList').size() <= 0) return true;

        var $getCloserPeopleList = $('.getCloserPeopleList');
        var nbrOfSlides = $getCloserPeopleList.children('li').size();

        var $getCloserTotalSlides = $('.getCloserTotalSlides');
        var $getCloserSlideNbr = $('.getCloserSlideNbr');
        var $getCloserPrev = $('.getCloserPrev');
        var $getCloserNext = $('.getCloserNext');
        var getCloserPeopleListHeight = 0;
        var slideNbr = 0;

        $getCloserTotalSlides.html(nbrOfSlides);

        $getCloserPeopleList.addClass('active');
        $getCloserPeopleList.children('li:not(:first)').hide();

        $getCloserPeopleList.children('li').each(function () {
            if (getCloserPeopleListHeight < $(this).height()) {
                getCloserPeopleListHeight = $(this).height();
            }
        });

        //$getCloserPeopleList.height(getCloserPeopleListHeight);
        $getCloserPrev.on('click', function () {
            if (slideNbr > 0) {
                slideNbr--;
            } else {

                slideNbr = nbrOfSlides - 1;
            }

            $getCloserSlideNbr.html(slideNbr + 1);
            getCloserPeopleAnim();
        });



        $getCloserNext.on('click', function () {
            if (slideNbr < nbrOfSlides - 1) {
                slideNbr++;
            } else {

                slideNbr = 0;
            }

            $getCloserSlideNbr.html(slideNbr + 1);
            getCloserPeopleAnim();
        });



        function getCloserPeopleAnim() {
            $getCloserPeopleList.children('li').fadeOut().eq(slideNbr).fadeIn();
        }




    },
    sideMenu: function () {
        if ($('.secondaryNav ul').size() <= 0) return true;
        $('.secondaryNav li.active').each(function () {
            var subMenuLi = $(this).next('li');
            $(this).children('.submenuBtn').addClass('active');
            if (subMenuLi.children('a').size() <= 0 && subMenuLi.children('ul').size() > 0) {
                $(this).append("<span class='submenuBtn active'></span>");
            }
        });
        $('.submenuBtn').on('click', function () {
            $(this).toggleClass('active');
            var submenuItem = $(this).parent().next().children('ul');
            if ($(this).hasClass('active')) {
                submenuItem.slideDown().parent();
            } else {

                submenuItem.slideUp();
            }
        });
    },

    init: function () {
        this.equalizeHeight();
        this.sideMenu();
        this.getCloser();
    }

};
equalheight = function (container) {

    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el,
        topPosition = 0;
    jQuery(container).each(function () {

        $el = jQuery(this);
        jQuery($el).height('auto');
        topPostion = $el.position().top;

        if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0; // empty the array
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
        } else {
            rowDivs.push($el);
            currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            rowDivs[currentDiv].height(currentTallest);
        }
    });
}



$(window).resize(function () {
    equalheight('colEqualHeight');
    if ($('.secondRow .box1Content .img').size() > 0) {
        if ($(window).width() <= 624) {
            equalizeBanners();
        } else {
            $('.secondRow .box1Content .img').each(function () {
                $(this).css('paddingTop', 0).css('paddingBottom', 0);
            })
        }
    }

});

function equalizeBanners() {
    $('.secondRow .box1Content .img').each(function () {
        width = $(this).width();
        height = $(this).height();

        imgHeight = $(this).children('img').height();

        console.log(imgHeight);
        paddingTopBottom = (width - imgHeight) / 2 - 24;
        console.log(paddingTopBottom);

        $(this).css('paddingTop', paddingTopBottom + 'px').css('paddingBottom', paddingTopBottom + 'px');
    })
}


$(window).load(function () {
    equalheight('.colEqualHeight');
    $(window).trigger('resize');
    PKF.equalizeHeight();
});


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
function isSpam() {
    if ($("#donotfillmein").val() != "")
        return false;
    return true;
}
function formats() {
    ($(".arrowList").parent()).addClass("customListArrow");
}
function socialMenu() {
    $("#topSocial li").each(function () {
        $(this).bind("mouseover", function (e) {
            e.preventDefault();
            $(this.childNodes[1]).css('display', 'block');
        });
        $(this).bind("mouseout", function (e) {
            e.preventDefault();
            $(".sites").css('display', 'none');
        });
    });
}
jQuery(document).ready(function () {
    $("header h2").click(function () {
        document.location = '/';
    });
    socialMenu();
    if ($(".closerSection").length != 0 && $(".closerSection").html().trim() == "") {
        $(".closerSection").hide();
    }
    $(document).keypress(function (e) {
        if (e.which == 13) {
            $(document.activeElement).next().click();
        }
    });
    $(".year").click(function (e) {
        if ($(this).find("ul").first().css('display') == "block")
            $(this).find("ul").first().css('display', 'none');
        else
            $(this).find("ul").first().css('display', 'block');
    });
    $("form").submit(function (e) {
        if ($("#donotfillmein").val() != "")
            e.preventDefault();
        return true;
    });
    formats();
    $(".publicationDownload").click(function (event) {
        if (isBehindEmail) {
            event.preventDefault();
            var href = this.href;
            $(this).hide();
            $("#emailsubmitContainer").show();
        }
    });
    $("#emailSubmitButton").click(function () {
        $.ajax({
            type: "get",
            async: false,
            url: 'http://api.pkf.edm.works/email/' + $("#emailSubmit").val() + "/" + pubEmailAddress,
            success: function (data) {
                if (data.indexOf("error") > -1)
                    $("#errorMessage").show();
                else {
                    $("#thankYouMessage").show();
                    $("#submitContainer").hide();
                    var dl = document.createElement('a');
                    dl.setAttribute('href', $(".publicationDownload").attr("href"));
                    dl.setAttribute('download', '');
                    dl.click();
                }
            }
        });
    });
    $(".geCloserSubmit").click(function () {
        if ($(".countries option:selected").index() == 0 && $(".services option:selected").index() == 0) {
            $(".err").show();
            return;
        }
        else
            $(".err").hide();
        var theTemplateScript = $("#entry-template").html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        $(".getCloserStep2").show();
        $(".getCloserStep1").hide();
        $("#imgLoading").show();
        $(".getCloserStep2").css("opacity", "0.2");

        $(".titleh").css("opacity", "0.2");
        $.ajax({
            type: "get",
            async: true,
            url: 'http://api.pkf.edm.works/contact/' + $(".services option:selected").val() + '/' + $(".countries option:selected").val(),
            success: function (data) {
                $('.content-placeholder').html(theTemplate(JSON.parse(data)));

                if (data.length == 2) {
                    $(".getCloserPeopleList").hide();
                    $(".getCloserPrev").hide();
                    $(".getCloserSlides").hide();
                    $(".getCloserNext").hide();
                    $(".noResults").show();
                } else {
                    $(".getCloserStep2").show();
                    $(".noResults").hide();
                    PKF.init();
                }
                $("#imgLoading").hide();
                $(".getCloserStep2").css("opacity", "1");
                $(".titleh").css("opacity", "1");
            }
        });
    });
    $(".getCloserReset").click(function () {
        location.reload();
    });
    $(".btn").click(function () {
        return isSpam();
    });
    if (getCookie("sort") != "")
        $(".ddlSort").val(getCookie("sort"));
    PKF.init();
    /*if ($('.languageSelectorContainer').children().length < 1)
        $("header").css('padding-top', '1.5rem');*/
    var col1 = new Array();
    var count = 0;
    $('.firms li').each(function () {
        var txt = $(this).find('.firmCity').text();
        col1[count] = txt;
        count++;
    });

    if ($("#displayLinksContainer").length == 1) {
        $("#pkfmap").css('height', '300px');


        $("#viewNodes").click(function () {
            event.preventDefault();
            if (getCookie("showAllOffices") == "")
                setCookie("showAllOffices", "all", 1);
            else if (getCookie("showAllOffices") == "selected")
                setCookie("showAllOffices", "all", 1);
            else
                setCookie("showAllOffices", "selected", 1);
            $("form").submit();
        });
    }

    jQuery.noConflict();

    if ($("#defaultSort").val() == "Date" && getCookie("sort") == "")
        $('.ddlSort').val("1");
    else if ($("#defaultSort").val() == "Alphabetical" && getCookie("sort") == "")
        $('.ddlSort').val("2");
    $('#nav-icon1').click(function () {
        $(this).toggleClass('open');
        $('.mainMenu, .topSearch').slideToggle();
    });

    $('.ddlSort').change(function () {
        if (getCookie("sort") == "" || getCookie("sort") != $(".ddlSort").val())
            setCookie("sort", $(".ddlSort").val(), 2);
        $("form").submit();
    });

    var contactInfoPannel = jQuery('.contactInfoPannel');
    //if (contactInfoPannel.size() > 0) {
    //    contactInfoPannel.parent().parent().parent().clone().insertBefore('footer').addClass('contactInfoPannelClone');
    //}
    $(".components.contactInfoPannel").each(function (index) {
        if ($(this).html().trim() == "")
            $(this).hide();
    });
    /* $('.item.featured img').resizeAndCrop({ width: 134, height: 134 });
     $('.item.regular img').resizeAndCrop({ width: 120, height: 120 });
     $('.item.highlight img').resizeAndCrop({ width: 100, height: 100 });
 
     $('.first.article .thumbnail img').resizeAndCrop({ width: 134, height: 134 });
     $('.secondary_article .thumbnail img').resizeAndCrop({ width: 120, height: 120 });
     $('.tertiary_article .thumbnail img').resizeAndCrop({ width: 100, height: 100 });*/

    $('.image-gallery a.img img').resizeAndCrop({ width: 125, height: 125 });

    if (jQuery('.contentColBody li h3').size() > 0) {
        jQuery('.contentColBody li h3').parent('li').addClass('subTitleList');
    }

    if (jQuery('.footerMenu > .col').size() > 4) {
        jQuery('.footerMenu').addClass('widerMenu');
    }

    /* LANG MENU --- START */

    $(".langMenu, .mainMenu > ul > li").hoverIntent({
        over: hoverIn,
        interval: 0,
        out: hoverOut
    });



    function hoverIn() { jQuery(this).addClass('active') };
    function hoverOut() { jQuery(this).removeClass('active') };

    /* LANG MENU --- END */


    /* function campaigns() {
         jQuery('.campaigns').children('.campaignList').css("left", "0%");
         if (jQuery('.campaigns').size() > 0) {
             carouselParent = jQuery('.campaigns');
             var carousel = jQuery('.campaigns').children('.campaignList');
             var next = jQuery('.campaigns').find('.next');
             var prev = jQuery('.campaigns').find('.prev');
             var nbrOfChildren = carousel.children('.campaign').size();
             var animateTime = Number(carousel.data('animationTime'));
             var elPerPage = 1;
             carousel.pos = 0;
 
             carousel.width(nbrOfChildren * 100 + '%');
             elPercent = 100;
             childrenWidth = (100 / elPerPage) * nbrOfChildren + '%';
             carousel.width(childrenWidth);
             carousel.children().width(100 / nbrOfChildren + '%');
 
 
             next.unbind('click').click(function () {
                 if (nbrOfChildren - elPerPage > carousel.pos) {
                     carousel.pos++;
                     //carousel.pos = 0;
 
                 } else {
                     carousel.pos = 0;
                 }
 
                 carousel.animate({
                     left: -(carousel.pos * elPercent) + '%'
                 })
             })
             prev.unbind('click').click(function () {
                 if (carousel.pos > 0) {
                     carousel.pos--;
 
                 } else {
                     carousel.pos = nbrOfChildren - 1;
                 }
                 carousel.animate({
                     left: -(carousel.pos * elPercent) + '%'
                 })
             })
 
             function animCampaign() {
                 if (nbrOfChildren - elPerPage > carousel.pos) {
                     next.trigger('click');
                 } else {
                     next.removeClass('hide');
                     carousel.pos = 0;
                     carousel.animate({
                         left: 0
                     })
                 }
             }
             var animInterval = setInterval(animCampaign, animateTime);
 
             jQuery('.campaigns').hover(function () {
                 clearInterval(animInterval);
             }, function () {
                 animInterval = setInterval(animCampaign, animateTime);
             })
 
         }
     } 
     campaigns();*/

    //jQuery(".mapWrap map").click(function () {
    //    jQuery(this).parent().toggleClass('active');
    //})

    $('.mapWrap > div').hover(
        function () { jQuery(this).addClass('active') },
        function () { jQuery(this).removeClass('active') }
    );
    if (jQuery('.slide-group').length > 0) {
        jQuery('.slide-group').slick({
            dots: true,
            arrows: false,
            speed: 200,
            infinite: true,
            slidesToShow: 1,
            centerMode: true,
            autoplay: true,
            centerPadding: '0px',
            ltr: true,
            autoplaySpeed: parseInt($(".hdnAutoUpdateInterval").val()) * 1000
        });
    };

    if (jQuery('.team-slider').length > 0) {
        jQuery('.team-slider').slick({
            dots: false,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1
        });
    };
    if (jQuery('.people-slider').length > 0) {
        jQuery('.people-slider').slick({
            dots: true,
            arrows: true,
            infinite: false,
            speed: 500,
            slidesToShow: 1
        });
    };

    jQuery('#showResults').click(function () {
        jQuery("#searchForm").hide();
        jQuery("#searchResults").fadeIn(1000);
        jQuery('.search-slider').slick({
            dots: true,
            arrows: false,
            infinite: false,
            speed: 500,
            slidesToShow: 1
        });
    });

    jQuery('#resetSearch').click(function () {
        jQuery('.search-slider').slick('unslick');
        jQuery("#searchResults").hide();
        jQuery("#searchForm").fadeIn(1000);

    });

    jQuery('#changeView').click(function () {
        if (jQuery(this).attr('data-view') == 'grid') {
            jQuery(this).text(gridViewText);
            jQuery(this).attr('data-view', 'list');
            jQuery('.gridView').removeClass('gridView').addClass('listView');
        } else {
            jQuery(this).text(listViewText);
            jQuery(this).attr('data-view', 'grid');
            jQuery('.listView').removeClass('listView').addClass('gridView');
        }
    });


    // detect IE versions
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
        jQuery('body').addClass('ie');
    }

    // force a:after reflow (Firefox bug) 
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        setTimeout(function () {
            jQuery('.campaign .more a').css('position', 'relative');
        }, 80);
    }

    jQuery('.gt-holder .lft').click(function () {
        var r = 0, dir = true;
        if (jQuery(this).hasClass('popup-block')) {
            dir = !dir;
            r = dir ? -290 : 0;
            jQuery('.gt-holder').stop().animate({ right: r + 'px' }, 500);
            jQuery(this).addClass('popup-active');
            jQuery(this).removeClass('popup-block');
        } else {
            jQuery('.gt-holder').stop().animate({ right: '-290px' }, 500);
            jQuery(this).addClass('popup-block');
            jQuery(this).removeClass('popup-active');
        }
    });

    /* firm locator
    ------------------- */
    var me = $('.firmLocator'),
        clearBtn = me.find('.clear');

    if (me.length) {
        // custom checkboxes on firm locator page
        me.on("change", 'input[type="radio"]', function (e) {
            var el = e.currentTarget.parentNode;
            me.find('.active').removeClass('active');
            e.currentTarget.parentNode.className = 'active';
        });
        // enable nth-child(odd) CSS for > IE9 in firm locator results
        // http://stackoverflow.com/questions/5574842/

        me.on("change keyup paste", "#filter", function (e) {
            var filterVal = jQuery(e.currentTarget).val(),
                none = jQuery('.scrollBox p');
            none.addClass('hide');
            if (filterVal !== '') {
                clearBtn.addClass('show');
                me.find('label').each(function () {
                    var el = jQuery(this);
                    el.removeClass('hide');
                    if (el.text().toLowerCase().search(filterVal.toLowerCase()) === -1) {
                        el.addClass('hide');
                    }
                });
                if (me.find('label:visible').length === 0) {
                    none.removeClass('hide');
                }
            } else {
                me.find('label.hide').removeClass('hide');
                clearBtn.removeClass('show');
            }
        });
        clearBtn.click(function (e) {
            e.preventDefault();
            jQuery('#filter').val('').trigger('change');
            clearBtn.removeClass('show');
            me.find('label').each(function () {
                var el = jQuery(this);
                el.removeClass('hide');
            });
        });
    }


});





/**
 * Module: rem - v1.3.2
 * Description: A polyfill to parse CSS links and rewrite pixel equivalents into head for non supporting browsers
 * Date Built: 2014-07-02
 * Copyright (c) 2014  | Chuck Carpenter <chuck.carpenter@me.com>,Lucas Serven <lserven@gmail.com>;
 * https://github.com/chuckcarpenter/REM-unit-polyfill
**/
!function (a) { "use strict"; var b = function () { var a = document.createElement("div"); return a.style.cssText = "font-size: 1rem;", /rem/.test(a.style.fontSize) }, c = function () { for (var a = document.getElementsByTagName("link"), b = [], c = 0; c < a.length; c++) "stylesheet" === a[c].rel.toLowerCase() && null === a[c].getAttribute("data-norem") && b.push(a[c].href); return b }, d = function () { for (var a = 0; a < m.length; a++) j(m[a], e) }, e = function (a, b) { if (q.push(a.responseText), r.push(b), r.length === m.length) { for (var c = 0; c < r.length; c++) f(q[c], r[c]); (m = n.slice(0)).length > 0 ? (r = [], q = [], n = [], d()) : g() } }, f = function (a, b) { for (var c, d = k(a).replace(/\/\*[\s\S]*?\*\//g, ""), e = /[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@]+\{[\w\d\s\-\/\\%#:!;,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:!;,.'"*()]*\}/g, f = d.match(e), g = /\d*\.?\d+rem/g, h = d.match(g), i = /(.*\/)/, j = i.exec(b)[0], l = /@import (?:url\()?['"]?([^'\)"]*)['"]?\)?[^;]*/gm; null !== (c = l.exec(a));) n.push(j + c[1]); null !== f && 0 !== f.length && (o = o.concat(f), p = p.concat(h)) }, g = function () { for (var a = /[\w\d\s\-\/\\%#:,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:!,.'"*()]*[;}]/g, b = 0; b < o.length; b++) { l += o[b].substr(0, o[b].indexOf("{") + 1); for (var c = o[b].match(a), d = 0; d < c.length; d++) l += c[d], d === c.length - 1 && "}" !== l[l.length - 1] && (l += "\n}") } h() }, h = function () { for (var a = 0; a < p.length; a++) s[a] = Math.round(parseFloat(p[a].substr(0, p[a].length - 3) * t)) + "px"; i() }, i = function () { for (var a = 0; a < s.length; a++) s[a] && (l = l.replace(p[a], s[a])); var b = document.createElement("style"); b.setAttribute("type", "text/css"), b.id = "remReplace", document.getElementsByTagName("head")[0].appendChild(b), b.styleSheet ? b.styleSheet.cssText = l : b.appendChild(document.createTextNode(l)) }, j = function (b, c) { try { var d = a.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") || new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest; d.open("GET", b, !0), d.onreadystatechange = function () { 4 === d.readyState && c(d, b) }, d.send(null) } catch (e) { if (a.XDomainRequest) { var f = new XDomainRequest; f.open("get", b), f.onload = function () { c(f, b) }, f.onerror = function () { return !1 }, f.send() } } }, k = function (b) { return a.matchMedia || a.msMatchMedia || (b = b.replace(/@media[\s\S]*?\}\s*\}/g, "")), b }; if (!b()) { var l = "", m = c(), n = [], o = [], p = [], q = [], r = [], s = [], t = ""; t = function () { var a, b = document, c = b.documentElement, d = b.body || b.createElement("body"), e = !b.body, f = b.createElement("div"), g = d.style.fontSize; return e && c.appendChild(d), f.style.cssText = "width:1em; position:absolute; visibility:hidden; padding: 0;", d.style.fontSize = "1em", d.appendChild(f), a = f.offsetWidth, e ? c.removeChild(d) : (d.removeChild(f), d.style.fontSize = g), a }(), d() } }(window);




