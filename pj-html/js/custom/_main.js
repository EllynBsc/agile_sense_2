"use strict";
/* Theme globals */
var TRX_ADDONS_STORAGE = {
    "site_url":"#",
    "vc_edit_mode":"0",
    "popup_engine":"magnific",
    "user_logged_in":"0",
    "email_mask":"^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
    "msg_ajax_error":"Invalid server answer!",
    "msg_magnific_loading":"Loading image",
    "msg_magnific_error":"Error loading image",
    "msg_error_like":"Error saving your like! Please, try again later.",
    "msg_field_name_empty":"The name can't be empty",
    "msg_field_email_empty":"Too short (or empty) email address",
    "msg_field_email_not_valid":"Invalid email address",
    "msg_field_text_empty":"The message text can't be empty",
    "msg_send_complete":"Send message complete!",
    "msg_send_error":"Transmit failed!",
    "scroll_to_anchor":"0",
    "update_location_from_anchor":"0",
    "msg_sc_googlemap_not_avail":"Googlemap service is not available",
    "msg_sc_googlemap_geocoder_error":"Error while geocode address"
};

var PJ_STORAGE = {
    "site_url":"#",
    "user_logged_in":"",
    "mobile_layout_width":"959",
    "menu_cache":"",
    "menu_animation_in":"fadeInUpSmall",
    "menu_animation_out":"fadeOutDownSmall",
    "use_mediaelements":"1",
    "message_maxlength":"1000",
    "site_scheme":"scheme_default",
    "admin_mode":"",
    "email_mask":"^([a-zA-Z0-9_\\-]+\\.)*[a-zA-Z0-9_\\-]+@[a-z0-9_\\-]+(\\.[a-z0-9_\\-]+)*\\.[a-z]{2,6}$",
    "strings":{"ajax_error":"Invalid server answer!",
    "error_global":"Error data validation!",
    "name_empty":"The name can&#039;t be empty",
    "name_long":"Too long name",
    "email_empty":"Too short (or empty) email address",
    "email_long":"Too long email address",
    "email_not_valid":"Invalid email address",
    "text_empty":"The message text can&#039;t be empty",
    "text_long":"Too long message text",
    "search_error":"Search error! Try again later.",
    "send_complete":"Send message complete!",
    "send_error":"Transmit failed!"},
    "menu_hover":"slide_line",
    "menu_hover_color":"#ffffff",
    "button_hover":"slide_left"
};

/* Timeline */
var my_timeline_front_ajax_nonce="dfc4f8c664";
var my_timeline_front_ajax_url="#";
if (jQuery(".timeline").length > 0) {
    var my_is_mobile_global=0; 
    (function($){ 
        var test = false; 
        $(window).load(function() { 
            if(!test) timeline_init_1($(document)); 
        }); 
        function timeline_init_1($this) { 
            $this.find(".scrollable-content").mCustomScrollbar();
            $this.find("a[rel^='prettyPhoto']").prettyPhoto(); 
            $this.find("#tl1").timeline({ 
                my_show_years:9, 
                my_del:130, 
                my_is_years:0, 
                my_trigger_width:800, 
                my_sizes :{"card":{"item_width":"370","item_height":"410","margin":"30"},"active":{"item_width":"420","item_height":"410","image_height":"150"}}, 
                my_id :1, 
                my_debug :0, 
                is_mobile : 0, 
                autoplay : 0, 
                autoplay_mob : 0, 
                autoplay_step: 10000, 
                itemMargin : 30, 
                scrollSpeed : 500, 
                easing : "easeOutSine", 
                openTriggerClass : '.read_more', 
                swipeOn : true, 
                startItem : "15/03/2016", 
                yearsOn : true, 
                hideTimeline : false, 
                hideControles : true, 
                closeText : "Close", 
                closeItemOnTransition: false 
            }); 
            $this.find("#tl1").on("ajaxLoaded.timeline", function(e){ 
                var scrCnt = e.element.find(".scrollable-content"); 
                scrCnt.height(scrCnt.parent().height() - scrCnt.parent().children("h2").height() - parseInt(scrCnt.parent().children("h2").css("margin-bottom"))); 
                scrCnt.mCustomScrollbar({theme:"light-thin"}); 
                e.element.find("a[rel^='prettyPhoto']").prettyPhoto(); 
                e.element.find(".timeline_rollover_bottom").timelineRollover("bottom"); 
            }); 
        } 
    })(jQuery);

}
/* Tribe Events */
var tribe_bootstrap_datepicker_strings = {"dates":{"days":["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],"daysShort":["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sun"],"daysMin":["S","M","T","W","T","F","S","S"],"months":["January","February","March","April","May","June","July","August","September","October","November","December"],"monthsShort":["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],"clear":"Clear","today":"Today"}};
var tribe_js_config = {"permalink_settings":"\/%postname%\/","events_post_type":"tribe_events","events_base":"http:\/\/pj.axiomthemes.com\/events\/"};
var tribe_events_linked_posts = {"post_types":{"tribe_venue":"venue","tribe_organizer":"organizer"}};

jQuery(document).ready(function() {
    "use strict";
    main_slider_init();
    reviews_stars();
    price_filter();
    woo_review_star();
    parallax_scroll();
    equal_heights();
    initShortcodes(jQuery('body').eq(0));

});

    jQuery(window).resize(function() {
        equal_heights()
    });

    // Scroll handlers
    jQuery(window).scroll(function() {
        "use strict";
        parallax_scroll();
    });

/*Revolution slider*/
function revslider_showDoubleJqueryError(sliderID) {
    "use strict";
	var errorMessage = "Revolution Slider Error: You have some jquery.js library include that comes after the revolution files js include.";
	errorMessage += "<br> This includes make eliminates the revolution slider libraries, and make it not work.";
	errorMessage += "<br><br> To fix it you can:<br>&nbsp;&nbsp;&nbsp; 1. In the Slider Settings -> Troubleshooting set option:  <strong><b>Put JS Includes To Body</b></strong> option to true.";
	errorMessage += "<br>&nbsp;&nbsp;&nbsp; 2. Find the double jquery.js include and remove it.";
	errorMessage = "<span style='font-size:16px;color:#BC0C06;'>" + errorMessage + "</span>";
	jQuery(sliderID).show().html(errorMessage);
}

function main_slider_init() {
	"use strict";
    if (jQuery(".slider_alias_homeslider-1").length > 0) {

        var htmlDiv = document.getElementById("rs-plugin-settings-inline-css"); var htmlDivCss="";
        if(htmlDiv) {
            htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
        }else{
            var htmlDiv = document.createElement("div");
            htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
            document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
        }

        var setREVStartSize=function(){
            try{var e=new Object,i=jQuery(window).width(),t=9999,r=0,n=0,l=0,f=0,s=0,h=0;
                e.c = jQuery('#rev_slider_1_1');
                e.gridwidth = [1250];
                e.gridheight = [900];
                e.sliderLayout = "fullscreen";
                e.fullScreenAutoWidth='off';
                e.fullScreenAlignForce='off';
                e.fullScreenOffsetContainer= '';
                e.fullScreenOffset='';
                if(e.responsiveLevels&&(jQuery.each(e.responsiveLevels,function(e,f){f>i&&(t=r=f,l=e),i>f&&f>r&&(r=f,n=e)}),t>r&&(l=n)),f=e.gridheight[l]||e.gridheight[0]||e.gridheight,s=e.gridwidth[l]||e.gridwidth[0]||e.gridwidth,h=i/s,h=h>1?1:h,f=Math.round(h*f),"fullscreen"==e.sliderLayout){var u=(e.c.width(),jQuery(window).height());if(void 0!=e.fullScreenOffsetContainer){var c=e.fullScreenOffsetContainer.split(",");if (c) jQuery.each(c,function(e,i){u=jQuery(i).length>0?u-jQuery(i).outerHeight(!0):u}),e.fullScreenOffset.split("%").length>1&&void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0?u-=jQuery(window).height()*parseInt(e.fullScreenOffset,0)/100:void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0&&(u-=parseInt(e.fullScreenOffset,0))}f=u}else void 0!=e.minHeight&&f<e.minHeight&&(f=e.minHeight);e.c.closest(".rev_slider_wrapper").css({height:f})
                
            }catch(d){console.log("Failure at Presize of Slider:"+d)}
        };
        
        setREVStartSize();
            
        var tpj=jQuery;
            
        var revapi1;
        if(tpj("#rev_slider_1_1").revolution == undefined){
            revslider_showDoubleJqueryError("#rev_slider_1_1");
        }else{
            revapi1 = tpj("#rev_slider_1_1").show().revolution({
                sliderType:"hero",
                jsFileLocation:"js/vendor/revslider/public/assets/js/",
                sliderLayout:"fullscreen",
                dottedOverlay:"none",
                delay:9000,
                navigation: {
                },
                visibilityLevels:[1240,1024,778,480],
                gridwidth:1250,
                gridheight:900,
                lazyType:"none",
                shadow:0,
                spinner:"spinner0",
                autoHeight:"off",
                fullScreenAutoWidth:"off",
                fullScreenAlignForce:"off",
                fullScreenOffsetContainer: "",
                fullScreenOffset: "",
                disableProgressBar:"on",
                hideThumbsOnMobile:"off",
                hideSliderAtLimit:0,
                hideCaptionAtLimit:0,
                hideAllCaptionAtLilmit:0,
                debugMode:false,
                fallbacks: {
                    simplifyAll:"off",
                    disableFocusListener:false,
                }
            });
        }
    }
    if (jQuery(".slider_alias_home-slider-3").length > 0) {

        var htmlDiv = document.getElementById("rs-plugin-settings-inline-css"); var htmlDivCss="";
        if(htmlDiv) {
            htmlDiv.innerHTML = htmlDiv.innerHTML + htmlDivCss;
        }else{
            var htmlDiv = document.createElement("div");
            htmlDiv.innerHTML = "<style>" + htmlDivCss + "</style>";
            document.getElementsByTagName("head")[0].appendChild(htmlDiv.childNodes[0]);
        }


        var setREVStartSize=function(){
            try{var e=new Object,i=jQuery(window).width(),t=9999,r=0,n=0,l=0,f=0,s=0,h=0;
                e.c = jQuery('#rev_slider_2_1');
                e.gridwidth = [1170];
                e.gridheight = [790];
                e.sliderLayout = "fullwidth";
                if(e.responsiveLevels&&(jQuery.each(e.responsiveLevels,function(e,f){f>i&&(t=r=f,l=e),i>f&&f>r&&(r=f,n=e)}),t>r&&(l=n)),f=e.gridheight[l]||e.gridheight[0]||e.gridheight,s=e.gridwidth[l]||e.gridwidth[0]||e.gridwidth,h=i/s,h=h>1?1:h,f=Math.round(h*f),"fullscreen"==e.sliderLayout){var u=(e.c.width(),jQuery(window).height());if(void 0!=e.fullScreenOffsetContainer){var c=e.fullScreenOffsetContainer.split(",");if (c) jQuery.each(c,function(e,i){u=jQuery(i).length>0?u-jQuery(i).outerHeight(!0):u}),e.fullScreenOffset.split("%").length>1&&void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0?u-=jQuery(window).height()*parseInt(e.fullScreenOffset,0)/100:void 0!=e.fullScreenOffset&&e.fullScreenOffset.length>0&&(u-=parseInt(e.fullScreenOffset,0))}f=u}else void 0!=e.minHeight&&f<e.minHeight&&(f=e.minHeight);e.c.closest(".rev_slider_wrapper").css({height:f})
            }catch(d){console.log("Failure at Presize of Slider:"+d)}
        };
        
        setREVStartSize();
        var tpj=jQuery;
        var revapi2;
            if(tpj("#rev_slider_2_1").revolution == undefined){
                revslider_showDoubleJqueryError("#rev_slider_2_1");
            }else{
                revapi2 = tpj("#rev_slider_2_1").show().revolution({
                    sliderType:"hero",
                    jsFileLocation:"js/vendor/revslider/public/assets/js/",
                    sliderLayout:"fullwidth",
                    dottedOverlay:"none",
                    delay:9000,
                    navigation: {
                    },
                    visibilityLevels:[1240,1024,778,480],
                    gridwidth:1170,
                    gridheight:790,
                    lazyType:"none",
                    shadow:0,
                    spinner:"spinner0",
                    autoHeight:"off",
                    disableProgressBar:"on",
                    hideThumbsOnMobile:"off",
                    hideSliderAtLimit:0,
                    hideCaptionAtLimit:0,
                    hideAllCaptionAtLilmit:0,
                    debugMode:false,
                    fallbacks: {
                        simplifyAll:"off",
                        disableFocusListener:false,
                    }
                });
            }
    }

}
                  
/*reviews stars*/
function reviews_stars() {
    "use strict";
    if (jQuery(".reviews_stars").length > 0) {
        // jQuery(".reviews_stars").each(function() {
        //     var percent = jQuery(this).attr("data-mark") * 20;
        //     jQuery(this).find('.reviews_stars_hover').css({'width': percent + '%'});
        // });
        jQuery(".reviews_stars").each(function() {
            var percent = jQuery(this).attr("data-mark");
            jQuery(this).find('.reviews_stars_hover').css({'width': percent + '%'});
        });
    }
}

// Price range slider
function price_filter() {
    "use strict";
    if (jQuery("#slider-range").length > 0) {
        jQuery("#slider-range").slider({
            range: true,
            min: 0,
            max: 250,
            values: [0, 250],
            slide: function(event, ui) {
                jQuery("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
            }
        });
        jQuery("#amount").val("$" + jQuery("#slider-range").slider("values", 0) +
            " - $" + jQuery("#slider-range").slider("values", 1));
    }
}
// Select review stars
function woo_review_star() {
    "use strict";
    if (jQuery(".stars", "#review_form").length > 0) {
        $(".stars", "#review_form").find("a").on("click", function() {
            if (jQuery('p.stars', "#review_form").hasClass('selected')){
            }
            else {
                jQuery('p.stars', "#review_form").addClass('selected');
            }
            $("a.active", "#review_form").removeClass("active");
            $(this).addClass("active");
            return false;
        });
    }
}

// Parallax scroll
function parallax_scroll(){
    "use strict";
    if (jQuery(".sc_parallax").length > 0) {
        jQuery('.sc_parallax').each(function(){
            var windowHeight = jQuery(window).height();
            var scrollTops = jQuery(window).scrollTop();
            var offsetPrx = Math.max(jQuery(this).offset().top, windowHeight);
            if ( offsetPrx <= scrollTops + windowHeight ) {
                var speed  = Number(jQuery(this).data('parallax-speed'));
                var xpos   = jQuery(this).data('parallax-x-pos');
                var ypos   = Math.round((offsetPrx - scrollTops - windowHeight) * speed + (speed < 0 ? windowHeight*speed : 0));
                jQuery(this).find('.sc_parallax_content').css('backgroundPosition', xpos+' '+ypos+'px');
                // Uncomment next line if you want parallax video (else - video position is static)
                //jQuery(this).find('div.sc_video_bg').css('top', ypos+'px');
            }
        });
    }
}

function equal_heights(){
    "use strict";
    // Select and loop the container element of the elements you want to equalise
    // if ( (jQuery(window).width() > 767) & (jQuery(window).width() < 960))   {
    if ( (jQuery(window).width() > 767) )   {
        jQuery('.column-equal-height').each(function(){  
          jQuery('[class*="container"] > .columns_wrap > .column_container',this).css('min-height', "");
          // Cache the highest
          var highestBox = 0;
          
          // Select and loop the elements you want to equalise
          jQuery('[class*="container"] > .columns_wrap > .column_container', this).each(function(){
            
            // If this box is higher than the cached highest then store it
            if($(this).height() > highestBox) {
              highestBox = $(this).height(); 
            }
          
          });  
                
          // Set the height of all those children to whichever was highest 
          jQuery('[class*="container"] > .columns_wrap > .column_container',this).css('min-height', highestBox);
                        
        }); 
    }else{
        jQuery('.column-equal-height').each(function(){  
            jQuery('[class*="container"] > .columns_wrap > .column_container',this).css('min-height', "");
        }); 
    }
}

function initShortcodes(container) {
    "use strict";
    // Tabs
    if (container.find('.sc_tabs:not(.inited),.tabs_area:not(.inited)').length > 0) {
        container.find('.sc_tabs:not(.inited),.tabs_area:not(.inited)').each(function () {
            var init = jQuery(this).data('active');
            if (isNaN(init)) init = 0;
            else init = Math.max(0, init);
            jQuery(this)
                .addClass('inited')
                .tabs({
                    active: init,
                    show: {
                        effect: 'fade',
                        duration: 250
                    },
                    hide: {
                        effect: 'fade',
                        duration: 200
                    },
                    create: function (event, ui) {
                        initShortcodes(ui.panel);
                    },
                    activate: function (event, ui) {
                        initShortcodes(ui.newPanel);
                    }
                });
        });
    }

    // Accordion
    if (container.find('.sc_accordion:not(.inited)').length > 0) {
        container.find(".sc_accordion:not(.inited)").each(function () {
            var init = jQuery(this).data('active');
            if (isNaN(init)) init = 0;
            else init = Math.max(0, init);
            jQuery(this)
                .addClass('inited')
                .accordion({
                    active: init,
                    heightStyle: "content",
                    header: "> .sc_accordion_item > .sc_accordion_title",
                    create: function (event, ui) {
                        initShortcodes(ui.panel);
                        ui.header.each(function () {
                            jQuery(this).parent().addClass('sc_active');
                        });
                    },
                    activate: function (event, ui) {
                        initShortcodes(ui.newPanel);
                        ui.newHeader.each(function () {
                            jQuery(this).parent().addClass('sc_active');
                        });
                        ui.oldHeader.each(function () {
                            jQuery(this).parent().removeClass('sc_active');
                        });
                    }
                });
        });
    }

    // Toggles
    if (container.find('.sc_toggles .sc_toggles_title:not(.inited)').length > 0) {
        container.find('.sc_toggles .sc_toggles_title:not(.inited)')
            .addClass('inited')
            .on('click', function () {
                jQuery(this).parent().toggleClass('sc_active');
                jQuery(this).parent().find('.sc_toggles_content').slideToggle(200, function () { 
                    initShortcodes(jQuery(this).parent().find('.sc_toggles_content')); 
                });
            });
    }

    //Skills init
    if (container.find('.sc_skills_item:not(.inited)').length > 0) {
        sc_init_skills(container);
        jQuery(window).scroll(function () { sc_init_skills(container); });
    }


}

// Skills init
function sc_init_skills(container) {
    "use strict";
    if (arguments.length==0) var container = jQuery('body');
    var scrollPosition = jQuery(window).scrollTop() + jQuery(window).height();

    container.find('.sc_skills_item:not(.inited)').each(function () {
        "use strict";
        var skillsItem = jQuery(this);
        var scrollSkills = skillsItem.offset().top;
        if (scrollPosition > scrollSkills) {
            skillsItem.addClass('inited');
            var skills = skillsItem.parents('.sc_skills').eq(0);
            var type = skills.data('type');
            var total = (type=='pie' && skills.hasClass('sc_skills_compact_on')) ? skillsItem.find('.sc_skills_data .pie') : skillsItem.find('.sc_skills_total').eq(0);
            var start = parseInt(total.data('start'));
            var stop = parseInt(total.data('stop'));
            var maximum = parseInt(total.data('max'));
            var startPercent = Math.round(start/maximum*100);
            var stopPercent = Math.round(stop/maximum*100);
            var ed = total.data('ed');
            var duration = parseInt(total.data('duration'));
            var speed = parseInt(total.data('speed'));
            var step = parseInt(total.data('step'));
            if (type == 'bar') {
                var dir = skills.data('dir');
                var count = skillsItem.find('.sc_skills_count').eq(0);
                if (dir=='horizontal')
                    count.css('width', startPercent + '%').animate({ width: stopPercent + '%' }, duration);
                else if (dir=='vertical')
                    count.css('height', startPercent + '%').animate({ height: stopPercent + '%' }, duration);
                sc_animate_skills_counter(start, stop, speed-(dir!='unknown' ? 5 : 0), step, ed, total);
            } else if (type == 'counter') {
                sc_animate_skills_counter(start, stop, speed - 5, step, ed, total);
            } else if (type == 'pie') {
                var steps = parseInt(total.data('steps'));
                var bg_color = total.data('bg_color');
                var border_color = total.data('border_color');
                var cutout = parseInt(total.data('cutout'));
                var easing = total.data('easing');
                var options = {
                    segmentShowStroke: true,
                    segmentStrokeColor: border_color,
                    segmentStrokeWidth: 1,
                    percentageInnerCutout : cutout,
                    animationSteps: steps,
                    animationEasing: easing,
                    animateRotate: true,
                    animateScale: false,
                };
                var pieData = [];
                total.each(function() {
                    "use strict";
                    var color = jQuery(this).data('color');
                    var stop = parseInt(jQuery(this).data('stop'));
                    var stopPercent = Math.round(stop/maximum*100);
                    pieData.push({
                        value: stopPercent,
                        color: color
                    });
                });
                if (total.length == 1) {
                    sc_animate_skills_counter(start, stop, Math.round(1500/steps), step, ed, total);
                    pieData.push({
                        value: 100-stopPercent,
                        color: bg_color
                    });
                }
                var canvas = skillsItem.find('canvas');
                canvas.attr({width: skillsItem.width(), height: skillsItem.width()}).css({width: skillsItem.width(), height: skillsItem.height()});
                new Chart(canvas.get(0).getContext("2d")).Doughnut(pieData, options);
            }
        }
    });
}

// Skills counter animation
function sc_animate_skills_counter(start, stop, speed, step, ed, total) {
    "use strict";
    start = Math.min(stop, start + step);
    total.text(start+ed);
    if (start < stop) {
        setTimeout(function () {
            sc_animate_skills_counter(start, stop, speed, step, ed, total);
        }, speed);
    }
}
