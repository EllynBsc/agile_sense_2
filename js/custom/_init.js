/* global jQuery:false */
/* global PJ_STORAGE:false */

jQuery(document).ready(function() {
	"use strict";
	PJ_STORAGE['theme_init_counter'] = 0;
	pj_init_actions();
});


// Theme init actions
function pj_init_actions() {
	"use strict";

	if (PJ_STORAGE['vc_edit_mode'] && jQuery('.vc_empty-placeholder').length==0 && PJ_STORAGE['theme_init_counter']++ < 30) {
		setTimeout(pj_init_actions, 200);
		return;
	}
	
	pj_ready_actions();
	pj_resize_actions();
	pj_scroll_actions();

	// Resize handlers
	jQuery(window).resize(function() {
		"use strict";
		pj_resize_actions();
	});

	// Scroll handlers
	jQuery(window).scroll(function() {
		"use strict";
		pj_scroll_actions();
	});
}



// Theme first load actions
//==============================================
function pj_ready_actions() {
	"use strict";

	// Add scheme class
	document.documentElement.className = document.documentElement.className.replace(/\bno-js\b/,'js');
	if (document.documentElement.className.indexOf(PJ_STORAGE['site_scheme'])==-1)
		document.documentElement.className += ' ' + PJ_STORAGE['site_scheme'];

	// Tabs
    //------------------------------------
	if (jQuery('.pj_tabs:not(.inited)').length > 0 && jQuery.ui && jQuery.ui.tabs) {
		jQuery('.pj_tabs:not(.inited)').each(function () {
			"use strict";
			// Get initially opened tab
			var init = jQuery(this).data('active');
			if (isNaN(init)) {
				init = 0;
				var active = jQuery(this).find('> ul > li[data-active="true"]').eq(0);
				if (active.length > 0) {
					init = active.index();
					if (isNaN(init) || init < 0) init = 0;
				}
			} else {
				init = Math.max(0, init);
			}
			// Init tabs
			jQuery(this).addClass('inited').tabs({
				active: init,
				show: {
					effect: 'fadeIn',
					duration: 300
				},
				hide: {
					effect: 'fadeOut',
					duration: 300
				},
				create: function( event, ui ) {
				    if (ui.panel.length > 0) jQuery(document).trigger('action.init_hidden_elements', [ui.panel]);
				},
				activate: function( event, ui ) {
				    if (ui.newPanel.length > 0) jQuery(document).trigger('action.init_hidden_elements', [ui.newPanel]);
				}
			});
		});
	}
	// AJAX loader for the tabs
	jQuery('.pj_tabs_ajax').on( "tabsbeforeactivate", function( event, ui ) {
		"use strict";
		if (ui.newPanel.data('need-content')) pj_tabs_ajax_content_loader(ui.newPanel, 1, ui.oldPanel);
	});
	// AJAX loader for the pages in the tabs
	jQuery('.pj_tabs_ajax').on( "click", '.nav-links a', function(e) {
		"use strict";
		var panel = jQuery(this).parents('.pj_tabs_content');
		var page = 1;
		var href = jQuery(this).attr('href');
		var pos = -1;
		if ((pos = href.lastIndexOf('/page/')) != -1 ) {
			page = Number(href.substr(pos+6).replace("/", ""));
			if (!isNaN(page)) page = Math.max(1, page);
		}
		pj_tabs_ajax_content_loader(panel, page);
		e.preventDefault();
		return false;
	});


	// Menu
    //----------------------------------------------

	// Prepare menus
	if (PJ_STORAGE['menu_cache']) pj_prepare_cached_menus();
	
	// Add TOC in the side menu
	if (jQuery('.menu_side_inner').length > 0 && jQuery('#toc_menu').length > 0)
		jQuery('#toc_menu').appendTo('.menu_side_inner');

	// Add arrows in mobile menu and WooCommerce categories on homepages
	jQuery('.menu_mobile .menu-item-has-children > a, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories .has_children > a').prepend('<span class="open_child_menu"></span>');

	// Mobile menu open/close
	jQuery('.menu_mobile_button').on('click', function(e){
		"use strict";
		jQuery('.menu_mobile_overlay').fadeIn();
		jQuery('.menu_mobile').addClass('opened');
		e.preventDefault();
		return false;
	});
	jQuery('.menu_mobile_close, .menu_mobile_overlay').on('click', function(e){
		"use strict";
		jQuery('.menu_mobile_overlay').fadeOut();
		jQuery('.menu_mobile').removeClass('opened');
		e.preventDefault();
		return false;
	});

	// Open/Close submenu in the mobile menu
	jQuery('.menu_mobile, body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories').on('click', 'li a,li a .open_child_menu, ul.product-categories.plain li a .open_child_menu', function(e) {
		"use strict";
		var $a = jQuery(this).hasClass('open_child_menu') ? jQuery(this).parent() : jQuery(this);
		if ($a.parent().hasClass('menu-item-has-children') || $a.parent().hasClass('has_children')) {
			if ($a.attr('href')=='#' || jQuery(this).hasClass('open_child_menu')) {
				if ($a.siblings('ul:visible').length > 0)
					$a.siblings('ul').slideUp().parent().removeClass('opened');
				else {
					jQuery(this).parents('li').siblings('li').find('ul:visible').slideUp().parent().removeClass('opened');
					$a.siblings('ul').slideDown().parent().addClass('opened');
				}
			}
		}
		if (jQuery(this).hasClass('open_child_menu') || $a.attr('href')=='#') {
			e.preventDefault();
			return false;
		}
	});
	
	// Init superfish menus
	pj_init_sfmenu('ul#menu_main');
	if (jQuery('ul#menu_main').hasClass('inited')) jQuery('.menu_main_nav_area').addClass('menu_show');
	
	// Store height of the top panel
	PJ_STORAGE['top_panel_height'] = 0;	//Math.max(0, jQuery('.top_panel_navi').height());



	// Search form
    //----------------------------------------------
	if (jQuery('.search_wrap:not(.inited)').length > 0) {
		jQuery('.search_wrap:not(.inited)').each(function() {
			"use strict";
			var ajax_timer = null;
			jQuery(this).addClass('inited');
			// Key is pressed
			jQuery(this).find('.search_field').on('keyup', function(e) {
				"use strict";
				if (jQuery(this).parents('.top_panel_navi').length > 0) {
					var search_field = jQuery(this);
					var search_wrap = search_field.parents('.search_wrap');
					// ESC is pressed
					if (e.keyCode == 27) {
						pj_search_close(search_wrap);
						e.preventDefault();
						return;
					}
					// Change icon after the search field on any key is pressed
					if (!search_wrap.hasClass('search_style_fullscreen')) {
						if (search_field.val() != '') {
							if (!search_field.siblings('.search_submit').hasClass('icon-search'))
								search_field.siblings('.search_submit').removeClass('icon-cancel').addClass('icon-search');
						} else {
							if (!search_field.siblings('.search_submit').hasClass('icon-cancel'))
								search_field.siblings('.search_submit').removeClass('icon-search').addClass('icon-cancel');
						}
					}
					// AJAX search
					if (search_wrap.hasClass('search_ajax')) {
						var s = search_field.val();
						if (ajax_timer) {
							clearTimeout(ajax_timer);
							ajax_timer = null;
						}
						if (s.length >= 4) {
							ajax_timer = setTimeout(function() {
								jQuery.post(PJ_STORAGE['ajax_url'], {
									action: 'ajax_search',
									nonce: PJ_STORAGE['ajax_nonce'],
									text: s
								}).done(function(response) {
									"use strict";
									clearTimeout(ajax_timer);
									ajax_timer = null;
									var rez = {};
									try {
										rez = JSON.parse(response);
									} catch (e) {
										rez = { error: PJ_STORAGE['search_error'] };
										console.log(response);
									}
									var msg = rez.error === '' ? rez.data : rez.error;
									search_field.parents('.search_ajax').find('.search_results_content').empty().append(rez.data);
									search_field.parents('.search_ajax').find('.search_results').fadeIn();
								});
							}, 500);
						}
					}
				}
			});
			// Click "Search submit"
			jQuery(this).find('.search_submit').on('click', function(e) {
				"use strict";
				var search_wrap = jQuery(this).parents('.search_wrap');
				if (search_wrap.find('.search_field').val() != '' && (jQuery(this).parents('.top_panel_navi').length == 0 || search_wrap.hasClass('search_opened')))
					search_wrap.find('form').get(0).submit();
				else if (jQuery(this).parents('.top_panel_navi').length > 0) {
					if (search_wrap.hasClass('search_opened')) {
						pj_search_close(search_wrap);
					} else {
						search_wrap.addClass('search_opened');
						if (search_wrap.find('.search_field').val() == '' && !search_wrap.hasClass('search_style_fullscreen'))
							search_wrap.find('.search_submit').removeClass('icon-search').addClass('icon-cancel');
						setTimeout(function() { search_wrap.find('.search_field').get(0).focus(); }, 500);
					}
				}
				e.preventDefault();
				return false;
			});
			// Click "Search close"
			jQuery(this).find('.search_close').on('click', function(e) {
				"use strict";
				pj_search_close(jQuery(this).parents('.search_wrap'));
				e.preventDefault();
				return false;
			});
			// Click "Close search results"
			jQuery(this).find('.search_results_close').on('click', function(e) {
				"use strict";
				jQuery(this).parent().fadeOut();
				e.preventDefault();
				return false;
			});
			// Click "More results"
			jQuery(this).on('click', '.search_more', function(e) {
				"use strict";
				if (jQuery(this).parents('.search_wrap').find('.search_field').val() != '')
					jQuery(this).parents('.search_wrap').find('form').get(0).submit();
				e.preventDefault();
				return false;
			});
		});
	}
	
	// Close search field (remove class 'search_opened' and close search results)
	function pj_search_close(search_wrap) {
		if (search_wrap.parents('.top_panel_navi').length > 0) {
			search_wrap.removeClass('search_opened');
			if (search_wrap.find('.search_submit').hasClass('icon-cancel'))
				search_wrap.find('.search_submit').removeClass('icon-cancel').addClass('icon-search');
			search_wrap.find('.search_results').fadeOut();
		}
	}


	// Widgets decoration
    //----------------------------------------------

	// Decorate nested lists in widgets and side panels
	jQuery('.widget ul > li').each(function() {
		"use strict";
		if (jQuery(this).find('ul').length > 0) {
			jQuery(this).addClass('has_children');
		}
	});

	// Archive widget decoration
	jQuery('.widget_archive a').each(function() {
		"use strict";
		var val = jQuery(this).html().split(' ');
		if (val.length > 1) {
			val[val.length-1] = '<span>' + val[val.length-1] + '</span>';
			jQuery(this).html(val.join(' '))
		}
	});


	// Forms validation
    //----------------------------------------------

	jQuery("select:visible:not(.esg-sorting-select)").wrap('<div class="select_container"></div>');

	// Comment form
	jQuery("form#commentform").submit(function(e) {
		"use strict";
		var rez = pj_comments_validate(jQuery(this));
		if (!rez)
			e.preventDefault();
		return rez;
	});

	jQuery("form").on('keypress', '.error_field', function() {
		if (jQuery(this).val() != '')
			jQuery(this).removeClass('error_field');
	});

	// WooCommerce
    //----------------------------------------------

	// Change display mode
	jQuery('.woocommerce,.woocommerce-page').on('click', '.pj_shop_mode_buttons a', function(e) {
		"use strict";
		var mode = jQuery(this).hasClass('woocommerce_thumbs') ? 'thumbs' : 'list';
		jQuery.cookie('pj_shop_mode', mode, {expires: 365, path: '/'});
		jQuery(this).siblings('input').val(mode).parents('form').get(0).submit();
		e.preventDefault();
		return false;
	});
	// Add buttons to quantity
	jQuery('.woocommerce div.quantity,.woocommerce-page div.quantity').append('<span class="q_inc"></span><span class="q_dec"></span>');
	jQuery('.woocommerce div.quantity').on('click', '>span', function(e) {
		"use strict";
		var f = jQuery(this).siblings('input');
		if (jQuery(this).hasClass('q_inc')) {
			f.val(Math.max(0, parseInt(f.val()),0)+1);
		} else {
			f.val(Math.max(1, Math.max(0, parseInt(f.val()),0)-1));
		}
		e.preventDefault();
		return false;
	});
	// Add stretch behaviour to WooC tabs area
	jQuery('.single-product .woocommerce-tabs').wrap('<div class="trx-stretch-width"></div>');
	jQuery('.trx-stretch-width').wrap('<div class="trx-stretch-width-wrap scheme_light"></div>');
	jQuery('.trx-stretch-width').after('<div class="trx-stretch-width-original"></div>');
	pj_stretch_width();
		

	// Pagination
    //------------------------------------

	// Load more
	jQuery('.nav-links-more a').on('click', function(e) {
		"use strict";
		if (PJ_STORAGE['load_more_link_busy']) return;
		PJ_STORAGE['load_more_link_busy'] = true;
		var more = jQuery(this);
		var page = Number(more.data('page'));
		var max_page = Number(more.data('max-page'));
		if (page >= max_page) {
			more.parent().hide();
			return;
		}
		more.parent().addClass('loading');
		jQuery.get(location.href, {
			page: page+1
		}).done(function(response) {
			"use strict";
			var container = jQuery('.content > .posts_container').eq(0);
			var content = jQuery(response).find('.content > .posts_container');
			if (content.length > 0 && container.length > 0) {
				container.append(content.html());
				more.data('page', page+1).parent().removeClass('loading');
				// Trigger actions to init new elements
				PJ_STORAGE['init_all_mediaelements'] = true;
				jQuery(document).trigger('action.init_shortcodes', [container]);
				jQuery(document).trigger('action.init_hidden_elements', [container]);
			}
			if (page+1 >= max_page)
				more.parent().hide();
			else
				PJ_STORAGE['load_more_link_busy'] = false;
			// Fire window.scroll after clearing busy state
			jQuery(window).trigger('scroll');
		});
		e.preventDefault();
		return false;
	});

	// Infinite scroll
    jQuery(document).on('action.scroll_actions', function(e) {
		"use strict";
		if (PJ_STORAGE['load_more_link_busy']) return;
		var container = jQuery('.content > .posts_container').eq(0);
		var inf = jQuery('.nav-links-infinite');
		if (inf.length == 0) return;
		if (container.offset().top + container.height() < jQuery(window).scrollTop() + jQuery(window).height())
			inf.find('a').trigger('click');
	});
		

	// Other settings
    //------------------------------------

	jQuery(document).trigger('action.ready');

	// Init post format specific scripts
	jQuery(document).on('action.init_hidden_elements', pj_init_post_formats);

	// Init hidden elements (if exists)
	jQuery(document).trigger('action.init_hidden_elements', [jQuery('body').eq(0)]);
	
} //end ready




// Scroll actions
//==============================================

// Do actions when page scrolled
function pj_scroll_actions() {
	"use strict";

	var scroll_offset = jQuery(window).scrollTop();
	var adminbar_height = Math.max(0, jQuery('#wpadminbar').height());

	if (PJ_STORAGE['top_panel_height'] == 0)	PJ_STORAGE['top_panel_height'] = jQuery('.top_panel_navi').outerHeight();

	// Call skin specific action (if exists)
    //----------------------------------------------
    jQuery(document).trigger('action.scroll_actions');

	// Fix/unfix top panel
	if (!jQuery('body').hasClass('mobile_layout') && !jQuery('body').hasClass('menu_style_side')) {
		var slider_height = 0;
		if (scroll_offset <= slider_height + PJ_STORAGE['top_panel_height']) {
			if (jQuery('body').hasClass('top_panel_fixed')) {
				jQuery('body').removeClass('top_panel_fixed');
				jQuery('.top_panel_navi').removeClass('state_fixed');
			}
		} else if (scroll_offset > slider_height + PJ_STORAGE['top_panel_height']) {
			if (!jQuery('body').hasClass('top_panel_fixed') && jQuery(document).height() > jQuery(window).height()*1.5) {
				jQuery('.top_panel_fixed_wrap').height(PJ_STORAGE['top_panel_height']);
				jQuery('.top_panel_navi').css('marginTop', '-150px').animate({'marginTop': 0}, 500);
				jQuery('.top_panel_navi').addClass('state_fixed');
				jQuery('body').addClass('top_panel_fixed');
			}
		}
	}
	
	// Fix/unfix sidebar
	// pj_fix_sidebar();
	
	// Scroll actions for animated elements
	jQuery('[data-animation^="animated"]:not(.animated)').each(function() {
		"use strict";
		if (jQuery(this).offset().top < jQuery(window).scrollTop() + jQuery(window).height())
			jQuery(this).addClass(jQuery(this).data('animation'));
	});
	
}

// Resize actions
//==============================================

// Do actions when page scrolled
function pj_resize_actions() {
	"use strict";
	pj_check_layout();
	// pj_fix_sidebar();
	pj_stretch_width();
	pj_vc_row_fullwidth_to_boxed();
}

// Check for mobile layout
function pj_check_layout() {
	"use strict";
	if (jQuery('body').hasClass('no_layout'))
		jQuery('body').removeClass('no_layout');
	var w = window.innerWidth;
	if (w == undefined) 
		w = jQuery(window).width()+(jQuery(window).height() < jQuery(document).height() || jQuery(window).scrollTop() > 0 ? 16 : 0);
	if (PJ_STORAGE['mobile_layout_width'] >= w) {
		if (!jQuery('body').hasClass('mobile_layout')) {
			jQuery('body').removeClass('top_panel_fixed desktop_layout').addClass('mobile_layout');
			jQuery('.top_panel_navi').removeClass('state_fixed');
		}
	} else {
		if (!jQuery('body').hasClass('desktop_layout')) {
			jQuery('body').removeClass('mobile_layout').addClass('desktop_layout');
			jQuery('.menu_mobile').removeClass('opened');
			jQuery('.menu_mobile_overlay').hide();
		}
	}
	// Switch popup menu / hierarchical list on product categories list placed in sidebar
	var cat_menu = jQuery('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
	var sb = cat_menu.parents('.widget_area');
	if (sb.length > 0 && cat_menu.length > 0) {
		if (sb.width() == sb.parents('.content_wrap').width()) {
			if (cat_menu.hasClass('inited')) {
				cat_menu.removeClass('inited').addClass('plain').superfish('destroy');
				cat_menu.find('ul.animated').removeClass('animated').addClass('no_animated');
			}
		} else {
			if (!cat_menu.hasClass('inited')) {
				cat_menu.removeClass('plain').addClass('inited');
				cat_menu.find('ul.no_animated').removeClass('no_animated').addClass('animated');
				pj_init_sfmenu('body:not(.woocommerce) .widget_area:not(.footer_wrap) .widget_product_categories ul.product-categories');
			}
		}
	}
}

// Stretch area to full window width
function pj_stretch_width() {
	"use strict";
	jQuery('.trx-stretch-width').each(function() {
		var $el = jQuery(this);
		var $el_cont = $el.parents('.page_wrap');
		var $el_cont_offset = 0;
		if ($el_cont.length == 0) 
			$el_cont = jQuery(window);
		else
			$el_cont_offset = $el_cont.offset().left;
		var $el_full = $el.next('.trx-stretch-width-original');
		var el_margin_left = parseInt( $el.css( 'margin-left' ), 10 );
		var el_margin_right = parseInt( $el.css( 'margin-right' ), 10 );
		var offset = $el_cont_offset - $el_full.offset().left - el_margin_left;
		var width = $el_cont.width();
		if (!$el.hasClass('inited')) {
			$el.addClass('inited invisible');
			$el.css({
				'position': 'relative',
				'box-sizing': 'border-box'
			});
		}
		$el.css({
			'left': offset,
			'width': $el_cont.width()
		});
		if ( !$el.hasClass('trx-stretch-content') ) {
			var padding = Math.max(0, -1*offset);
			var paddingRight = Math.max(0, width - padding - $el_full.width() + el_margin_left + el_margin_right);
			$el.css( { 'padding-left': padding + 'px', 'padding-right': paddingRight + 'px' } );
		}
		$el.removeClass('invisible');
	});
}

// Width vc_row when content boxed
function pj_vc_row_fullwidth_to_boxed() {
	"use strict";
   if (jQuery('body').hasClass('body_style_boxed')) {
       var width_body = jQuery('body').width();
       var width_content = jQuery('.page_wrap').width();
       var width_content_wrap = jQuery('.page_content_wrap  .content_wrap').width();
       var indent = ( width_content - width_content_wrap ) / 2;
	   if ( width_body > width_content ){
		   jQuery('.vc_row[data-vc-full-width="true"]').each( function() {
				"use strict";
				var mrg = parseInt(jQuery(this).css('marginLeft'),0);
				jQuery(this).css({
					'width': width_content,
					'left': -indent-mrg,
					'padding-left': indent+mrg,
					'padding-right': indent+mrg
				});
				if (jQuery(this).attr('data-vc-stretch-content')) {
				   jQuery(this).css({
					   'padding-left': 0,
					   'padding-right': 0
				   });
				}
		   });
	   }
   }
}


// Fix/unfix sidebar
function pj_fix_sidebar() {
	"use strict";
	var sb = jQuery('.sidebar');
	if (sb.length > 0) {

		// Unfix when sidebar is under content
		if (jQuery('.page_content_wrap .content_wrap .content').css('float') == 'none') {
			if (sb.css('position')=='fixed') {
				sb.css({
					'float': sb.hasClass('right') ? 'right' : 'left',
					'position': 'static'
				});
			}

		} else {

			var sb_height = sb.outerHeight();
			var content_height = sb.siblings('.content').outerHeight();
			var scroll_offset = jQuery(window).scrollTop();
			var top_panel_height = jQuery('.top_panel').length > 0 ? jQuery('.top_panel').outerHeight() : 0;
			var widgets_above_page_height = jQuery('.widgets_above_page_wrap').length > 0 ? jQuery('.widgets_above_page_wrap').height() : 0;
			var page_padding = parseInt(jQuery('.page_content_wrap').css('paddingTop'),0);
			if (isNaN(page_padding)) page_padding = 0;

			if (sb_height < content_height && 
				(sb_height >= jQuery(window).height() && scroll_offset + jQuery(window).height() > sb_height+top_panel_height+widgets_above_page_height+page_padding
				||
				sb_height < jQuery(window).height() && scroll_offset > top_panel_height+widgets_above_page_height+page_padding )
				) {
				
				// Fix when sidebar bottom appear
				if (sb.css('position')!=='fixed') {
					sb.css({
						'float': 'none',
						'position': 'fixed',
						'top': Math.min(0, jQuery(window).height() - sb_height) + 'px'
					});
				}
				
				// Detect horizontal position when resize
				var pos = jQuery('.page_content_wrap .content_wrap').position();
				pos = pos.left + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('paddingLeft')),0) + Math.max(0, parseInt(jQuery('.page_content_wrap .content_wrap').css('marginLeft')),0);
				if (sb.hasClass('right'))
					sb.css({ 'right': pos });
				else
					sb.css({ 'left': pos });
				
				// Shift to top when footer appear
				var footer_top = 0;
				var footer_pos = jQuery('.footer_wrap').position();
				var widgets_below_page_pos = jQuery('.widgets_below_page_wrap').position();
				var copyright_pos = jQuery('.copyright_wrap').position();
				if (widgets_below_page_pos)
					footer_top = widgets_below_page_pos.top;
				else if (footer_pos)
					footer_top = footer_pos.top;
				else if (copyright_pos)
					footer_top = copyright_pos.top;
				if (footer_top > 0 && scroll_offset + jQuery(window).height() > footer_top)
					sb.css({
						'top': Math.min(top_panel_height+page_padding, jQuery(window).height() - sb_height - (scroll_offset + jQuery(window).height() - footer_top + 30)) + 'px'
					});
				else
					sb.css({
						'top': Math.min(top_panel_height+page_padding, jQuery(window).height() - sb_height) + 'px'
					});
				

			} else {

				// Unfix when page scrolling to top
				if (sb.css('position')=='fixed') {
					sb.css({
						'float': sb.hasClass('right') ? 'right' : 'left',
						'position': 'static',
						'top': 'auto',
						'left': 'auto',
						'right': 'auto'
					});
				}

			}
		}
	}
}





// Navigation
//==============================================

// Init Superfish menu
function pj_init_sfmenu(selector) {
	"use strict";
	jQuery(selector).show().each(function() {
		"use strict";
		jQuery(this).addClass('inited').superfish({
			delay: 500,
			animation: {
				opacity: 'show'
			},
			animationOut: {
				opacity: 'hide'
			},
			speed: 		PJ_STORAGE['menu_animation_in']!='none' ? 500 : 200,
			speedOut:	PJ_STORAGE['menu_animation_out']!='none' ? 500 : 200,
			autoArrows: false,
			dropShadows: false,
			onBeforeShow: function(ul) {
				"use strict";
				if (jQuery(this).parents("ul").length > 1){
					var w = jQuery(window).width();  
					var par_offset = jQuery(this).parents("ul").offset().left;
					var par_width  = jQuery(this).parents("ul").outerWidth();
					var ul_width   = jQuery(this).outerWidth();
					if (par_offset+par_width+ul_width > w-20 && par_offset-ul_width > 0)
						jQuery(this).addClass('submenu_left');
					else
						jQuery(this).removeClass('submenu_left');
				}
				if (PJ_STORAGE['menu_animation_in']!='none') {
					jQuery(this).removeClass('animated fast '+PJ_STORAGE['menu_animation_out']);
					jQuery(this).addClass('animated fast '+PJ_STORAGE['menu_animation_in']);
				}
			},
			onBeforeHide: function(ul) {
				"use strict";
				if (PJ_STORAGE['menu_animation_out']!='none') {
					jQuery(this).removeClass('animated fast '+PJ_STORAGE['menu_animation_in']);
					jQuery(this).addClass('animated fast '+PJ_STORAGE['menu_animation_out']);
				}
			}
		});
	});
}

// Prepare menus (if menu cache is used)
function pj_prepare_cached_menus() {
	"use strict";

	// Mark the current menu item and its parent items in the cached menus
	var menus = [
		jQuery('ul#menu_main'),
		jQuery('ul#menu_mobile')
	];
	var href = window.location.href;
	for (var m in menus) {
		if (menus[m].length==0) continue;
		menus[m].find('li').removeClass('current-menu-ancestor current-menu-parent current-menu-item current_page_item');
		menus[m].find('a[href="'+href+'"]').each(function(idx) {
			var li = jQuery(this).parent();
			li.addClass('current-menu-item');
			if (li.hasClass('menu-item-object-page')) li.addClass('current_page_item');
			var cnt = 0;
			while ((li = li.parents('li')).length > 0) {
				cnt++;
				li.addClass('current-menu-ancestor'+(cnt==1 ? ' current-menu-parent' : ''));
			}
		});
	}
}




// Post formats init
//=====================================================

function pj_init_post_formats(e, cont) {
	"use strict";

	// MediaElement init
	pj_init_media_elements(cont);
	
	// Video play button
	cont.find('.format-video .post_featured.with_thumb .post_video_hover:not(.inited)')
		.addClass('inited')
		.on('click', function(e) {
			"use strict";
			jQuery(this).parents('.post_featured')
				.addClass('post_video_play')
				.find('.post_video').html(jQuery(this).data('video'));
			jQuery(window).trigger('resize');
			e.preventDefault();
			return false;
		});
}


function pj_init_media_elements(cont) {
	"use strict";
	if (PJ_STORAGE['use_mediaelements'] && cont.find('audio,video').length > 0) {
		if (window.mejs) {
			window.mejs.MepDefaults.enableAutosize = true;
			window.mejs.MediaElementDefaults.enableAutosize = true;
			cont.find('audio,video').each(function() {
				"use strict";
				if (jQuery(this).parents('.mejs-mediaelement').length == 0 && (PJ_STORAGE['init_all_mediaelements'] || (!jQuery(this).hasClass('wp-audio-shortcode') && !jQuery(this).hasClass('wp-video-shortcode') && !jQuery(this).parent().hasClass('wp-playlist')))) {
					var media_tag = jQuery(this);
					var settings = {
						enableAutosize: true,
						videoWidth: -1,		// if set, overrides <video width>
						videoHeight: -1,	// if set, overrides <video height>
						audioWidth: '100%',	// width of audio player
						audioHeight: 30,	// height of audio player
						success: function(mejs) {
							var autoplay, loop;
							if ( 'flash' === mejs.pluginType ) {
								autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
								loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;
								autoplay && mejs.addEventListener( 'canplay', function () {
									mejs.play();
								}, false );
								loop && mejs.addEventListener( 'ended', function () {
									mejs.play();
								}, false );
							}
						}
					};
					jQuery(this).mediaelementplayer(settings);
				}
			});
		} else
			setTimeout(function() { pj_init_media_elements(cont); }, 400);
	}
}


// Load the tab's content
function pj_tabs_ajax_content_loader(panel, page, oldPanel) {
	"use strict";
	if (panel.html().replace(/\s/g, '')=='') {
		var height = oldPanel === undefined ? panel.height() : oldPanel.height();
		if (isNaN(height) || height < 100) height = 100;
		panel.html('<div class="pj_tab_holder" style="min-height:'+height+'px;"></div>');
	} else
		panel.find('> *').css('opacity', 0);
	panel.data('need-content', false).addClass('pj_loading');
	jQuery.post(PJ_STORAGE['ajax_url'], {
		nonce: PJ_STORAGE['ajax_nonce'],
		action: 'pj_ajax_get_posts',
		blog_template: panel.data('blog-template'),
		blog_style: panel.data('blog-style'),
		posts_per_page: panel.data('posts-per-page'),
		cat: panel.data('cat'),
		parent_cat: panel.data('parent-cat'),
		page: page
	}).done(function(response) {
		"use strict";
		panel.removeClass('pj_loading');
		var rez = {};
		try {
			rez = JSON.parse(response);
		} catch (e) {
			rez = { error: PJ_STORAGE['strings']['ajax_error'] };
			console.log(response);
		}
		if (rez.error !== '') {
			panel.html('<div class="pj_error">'+rez.error+'</div>');
		} else {
			panel.prepend(rez.data).fadeIn(function() {
			    jQuery(document).trigger('action.init_shortcodes', [panel]);
			    jQuery(document).trigger('action.init_hidden_elements', [panel]);
				// Remove holder after images are loaded
				setTimeout(function() {
					panel.find('.pj_tab_holder').remove();
				}, 1000);
			});
		}
	});
}


// Forms validation
//-------------------------------------------------------

// Comments form
function pj_comments_validate(form) {
	"use strict";
	form.find('input').removeClass('error_field');
	var comments_args = {
		error_message_text: PJ_STORAGE['strings']['error_global'],	// Global error message text (if don't write in checked field)
		error_message_show: true,									// Display or not error message
		error_message_time: 4000,									// Error message display time
		error_message_class: 'pj_messagebox pj_messagebox_style_error',	// Class appended to error message block
		error_fields_class: 'error_field',							// Class appended to error fields
		exit_after_first_error: false,								// Cancel validation and exit after first error
		rules: [
			{
				field: 'comment',
				min_length: { value: 1, message: PJ_STORAGE['strings']['text_empty'] },
				max_length: { value: PJ_STORAGE['message_maxlength'], message: PJ_STORAGE['strings']['text_long']}
			}
		]
	};
	if (form.find('.comments_author input[aria-required="true"]').length > 0) {
		comments_args.rules.push(
			{
				field: 'author',
				min_length: { value: 1, message: PJ_STORAGE['strings']['name_empty']},
				max_length: { value: 60, message: PJ_STORAGE['strings']['name_long']}
			}
		);
	}
	if (form.find('.comments_email input[aria-required="true"]').length > 0) {
		comments_args.rules.push(
			{
				field: 'email',
				min_length: { value: 7, message: PJ_STORAGE['strings']['email_empty']},
				max_length: { value: 60, message: PJ_STORAGE['strings']['email_long']},
				mask: { value: PJ_STORAGE['email_mask'], message: PJ_STORAGE['strings']['email_not_valid']}
			}
		);
	}
	var error = pj_form_validate(form, comments_args);
	return !error;
}
