(function(jQuery) {
    "use strict";
    var registerDependencies = function() {
            if (null != PluginJsConfig && null != PluginJsConfig.js_dependencies) {
                var js_dependencies = PluginJsConfig.js_dependencies;
                for (var dependency in js_dependencies) {
                    asyncloader.register(js_dependencies[dependency], dependency);
                }
            }
            // console.log(PluginJsConfig.js_dependencies);
        },
        timer = function() {
            jQuery('.timer').countTo();
        },
        isotope = function() {
            jQuery(window).on('load', function() {
                jQuery('.pt-masonry, .pt-grid').isotope('layout');
            });
            jQuery('.pt-masonry').isotope({
                itemSelector: '.pt-masonry-item',
                masonry: {
                    columnWidth: '.grid-sizer',
                    // gutter: 0
                }
            });
            jQuery('.pt-grid').isotope({
                itemSelector: '.pt-grid-item',
            });
            jQuery('.pt-filter-button-group').on('click', '.pt-filter-btn', function() {
                var filterValue = jQuery(this).attr('data-filter');
                // console.log(filterValue);
                jQuery('.pt-masonry').isotope({
                    filter: filterValue
                });
                jQuery('.pt-grid').isotope({
                    filter: filterValue
                });
                jQuery('.pt-filter-button-group .pt-filter-btn').removeClass('active');
                jQuery(this).addClass('active');
                updateFilterCounts();
            });
            var initial_items = 5;
            var next_items = 3;
            if (jQuery('.pt-masonry').length > 0) {
                var initial_items = jQuery('.pt-masonry').data('initial_items');
                var next_items = jQuery('.pt-masonry').data('next_items');
            }
            if (jQuery('.pt-grid').length > 0) {
                var initial_items = jQuery('.pt-grid').data('initial_items');
                var next_items = jQuery('.pt-grid').data('next_items');
            }

            function showNextItems(pagination) {
                var itemsMax = jQuery('.visible_item').length;
                var itemsCount = 0;
                jQuery('.visible_item').each(function() {
                    if (itemsCount < pagination) {
                        jQuery(this).removeClass('visible_item');
                        itemsCount++;
                    }
                });
                if (itemsCount >= itemsMax) {
                    jQuery('#showMore').hide();
                }
                if (jQuery('.pt-masonry').length > 0) {
                    jQuery('.pt-masonry').isotope('layout');
                }
                if (jQuery('.pt-grid').length > 0) {
                    jQuery('.pt-grid').isotope('layout');
                }
            }
            // function that hides items when page is loaded
            function hideItems(pagination) {
                var itemsMax = jQuery('.pt-filter-items').length;
                // console.log(itemsMax);
                var itemsCount = 0;
                jQuery('.pt-filter-items').each(function() {
                    if (itemsCount >= pagination) {
                        jQuery(this).addClass('visible_item');
                    }
                    itemsCount++;
                });
                if (itemsCount < itemsMax || initial_items >= itemsMax) {
                    jQuery('#showMore').hide();
                }
                if (jQuery('.pt-masonry').length > 0) {
                    jQuery('.pt-masonry').isotope('layout');
                }
                if (jQuery('.pt-grid').length > 0) {
                    jQuery('.pt-grid').isotope('layout');
                }
            }
            jQuery('#showMore').on('click', function(e) {
                e.preventDefault();
                showNextItems(next_items);
            });
            hideItems(initial_items);

            function updateFilterCounts() {
                // get filtered item elements
                if (jQuery('.pt-masonry').length > 0) {
                    var itemElems = jQuery('.pt-masonry').isotope('getFilteredItemElements');
                }
                if (jQuery('.pt-grid').length > 0) {
                    var itemElems = jQuery('.pt-grid').isotope('getFilteredItemElements');
                }
                var count_items = jQuery(itemElems).length;
                // console.log(count_items);
                if (count_items > initial_items) {
                    jQuery('#showMore').show();
                } else {
                    jQuery('#showMore').hide();
                }
                if (jQuery('.pt-filter-items').hasClass('visible_item')) {
                    jQuery('.pt-filter-items').removeClass('visible_item');
                }
                var index = 0;
                jQuery(itemElems).each(function() {
                    if (index >= initial_items) {
                        jQuery(this).addClass('visible_item');
                    }
                    index++;
                });
                if (jQuery('.pt-masonry').length > 0) {
                    jQuery('.pt-masonry').isotope('layout');
                }
                if (jQuery('.pt-grid').length > 0) {
                    jQuery('.pt-grid').isotope('layout');
                }
            }
        },
        owl_carousel = function() {
            jQuery('.owl-carousel').each(function() {
                var app_slider = jQuery(this);
                var rtl = false;
                var prev = 'ion-ios-arrow-back';
                var next = 'ion-ios-arrow-forward';
                var prev_text = 'Prev';
                var next_text = 'Next';
                if (jQuery('body').hasClass('pt-is-rtl')) {
                    rtl = true;
                    prev = 'ion-ios-arrow-forward';
                    next = 'ion-ios-arrow-back';
                }
                if (app_slider.data('prev_text') && app_slider.data('prev_text') != '') {
                    prev_text = app_slider.data('prev_text');
                }
                if (app_slider.data('next_text') && app_slider.data('next_text') != '') {
                    next_text = app_slider.data('next_text');
                }
                app_slider.owlCarousel({
                    rtl: rtl,
                    items: app_slider.data("desk_num"),
                    loop: app_slider.data("loop"),
                    margin: app_slider.data("margin"),
                    nav: app_slider.data("nav"),
                    dots: app_slider.data("dots"),
                    loop: app_slider.data("loop"),
                    autoplay: app_slider.data("autoplay"),
                    autoplayHoverPause: true,
                    autoplayTimeout: app_slider.data("autoplay-timeout"),
                    navText: ["<i class='" + prev + "'></i>", "<i class='" + next + "'></i>"],
                    responsiveClass: true,
                    responsive: {
                        // breakpoint from 0 up
                        0: {
                            items: app_slider.data("mob_sm"),
                            nav: true,
                            dots: false
                        },
                        // breakpoint from 480 up
                        480: {
                            items: app_slider.data("mob_num"),
                            nav: true,
                            dots: false
                        },
                        // breakpoint from 786 up
                        786: {
                            items: app_slider.data("tab_num")
                        },
                        // breakpoint from 1023 up
                        1023: {
                            items: app_slider.data("lap_num")
                        },
                        1199: {
                            items: app_slider.data("desk_num")
                        }
                    }
                });
                //new added start

                // ✅ Trigger refresh after a slight delay
                setTimeout(function() {
                    app_slider.trigger('refresh.owl.carousel');
                }, 500);
                //new added end
            });
        },
        pop_video = function() {
            jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps, .button-play').magnificPopup({
                type: 'iframe',
                mainClass: 'mfp-fade',
                preloader: true,
            });
        },
        slick_slider = function() {
            if (jQuery('.slick-slider-main').length) {
                var $slider = jQuery('.slick-slider-main')
                    .slick({
                        slidesToShow: 1,
                        infinite: false,
                        arrows: true,
                        autoplay: false,
                        dots: false,
                        lazyLoad: 'ondemand',
                        autoplaySpeed: 3000,
                        loop: true,
                        asNavFor: '.slick-slider-thumb'
                    });
                var $slider2 = jQuery('.slick-slider-thumb')
                    .slick({
                        slidesToShow: 3,
                        infinite: false,
                        lazyLoad: 'ondemand',
                        asNavFor: '.slick-slider-main',
                        autoplay: false,
                        dots: false,
                        Default: '50px',
                        arrows: false,
                        centerMode: false,
                        loop: true,
                        focusOnSelect: true
                    });
            }
        },
        circle_progress = function() {
            jQuery('.pt-circle-progress-bar').each(function() {
                var number = jQuery(this).data('skill-level');
                var empty_color = jQuery(this).data('empty-color');
                var fill_color = jQuery(this).data('fill-color');
                var size = jQuery(this).data('size');
                var thickness = jQuery(this).data('thickness');
                jQuery(this).circleProgress({
                    value: '0.' + number,
                    size: size,
                    emptyFill: empty_color,
                    fill: {
                        color: fill_color
                    }
                }).on('circle-animation-progress', function(event, progress) {
                    jQuery(this).find('.pt-progress-count').html(Math.round(number * progress) + '%');
                });
            });
        },
        progress_bar = function() {
            jQuery('.pt-progress-bar > span').each(function() {
                var app_slider = jQuery('.pt-progressbar-box');
                jQuery(this).progressBar({
                    shadow: false,
                    animation: true,
                    height: app_slider.data('h'),
                    percentage: false,
                    border: false,
                    animateTarget: true,
                });
                var progress_bar = jQuery(this);
                var width = jQuery(this).data('percent');
                progress_bar.css({
                    'transition': 'width 2s'
                });
                jQuery('.progress-value').css({
                    'transition': 'margin 2s'
                });
                setTimeout(function() {
                    jQuery(this).show(function() {
                        progress_bar.css('width', width + '%');
                    });
                }, 500);
                setTimeout(function() {
                    jQuery('.pt-progressbar-style-1  .progress-value').show(function() {
                        jQuery('.pt-progressbar-style-1  .progress-value').css('margin-left', width + 'px');
                    });
                }, 500);
                setTimeout(function() {
                    jQuery('.pt-progressbar-style-3 .progress-tooltip').show(function() {
                        jQuery('.pt-progressbar-style-3 .progress-tooltip').css('margin-left', width + 'px');
                    });
                }, 500);
            });
        },
        award_image_effect = function(e) {
            jQuery('.pt-service-box.pt-style-1 .service-tabs-item:first-child').addClass("active");
            jQuery('.pt-service-box.pt-style-1 .service-tabs-item').on({
                mouseenter: function() {
                    jQuery('.pt-service-box.pt-style-1 .service-tabs-item').removeClass('active');
                    jQuery(this).addClass('active');
                },
            });
        },
        process_step_effect = function(e) {
            window.addEventListener('scroll', function() {
                var elements = document.querySelectorAll('.pt-process-step');
                var windowHeight = window.innerHeight;
                var scrollPosition = window.scrollY;

                elements.forEach(function(element) {
                    var elementRect = element.getBoundingClientRect();
                    var elementTop = elementRect.top;
                    var elementBottom = elementRect.bottom;

                    // Check if any part of the element is in the top half of the viewport
                    if (elementTop < windowHeight / 2) {
                        element.classList.add('pt-active');
                    } else {
                        element.classList.remove('pt-active');
                    }
                });
            });
        },
        new_timeline = function(e) {
            var mySwiper = new Swiper(".swiper", {
                autoHeight: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false
                },
                speed: 500,
                direction: "horizontal",
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev"
                },
                pagination: {
                    el: ".swiper-pagination",
                    type: "progressbar"
                },
                loop: false,
                effect: "slide",
                spaceBetween: 30,
                on: {
                    init: function() {
                        jQuery(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
                        jQuery(".swiper-pagination-custom .swiper-pagination-switch").eq(0).addClass("active");
                    },
                    slideChangeTransitionStart: function() {
                        jQuery(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
                        jQuery(".swiper-pagination-custom .swiper-pagination-switch").eq(mySwiper.realIndex).addClass("active");
                    }
                }
            });
            jQuery(".swiper-pagination-custom .swiper-pagination-switch").click(function() {
                mySwiper.slideTo(jQuery(this).index());
                jQuery(".swiper-pagination-custom .swiper-pagination-switch").removeClass("active");
                jQuery(this).addClass("active");
            });
        },
        counter = function() {
            var counted = 0;
            var Toduration = 0;
            jQuery(window).scroll(function() {
                var oTop = jQuery('.pt-counter-info').offset().top - window.innerHeight;
                if (counted == 0 && jQuery(window).scrollTop() > oTop) {
                    jQuery('.pt-count').each(function() {
                        var $this = jQuery(this),
                            countTo = $this.attr('data-count');
                        var Toduration = parseInt($this.attr('pt-duration')); // Parse int to ensure it's a number
                        // console.log(Toduration);
                        jQuery({
                            countNum: $this.text()
                        }).animate({
                            countNum: countTo
                        }, {
                            duration: Toduration,
                            easing: 'swing',
                            step: function() {
                                $this.text(Math.floor(this.countNum));
                            },
                            complete: function() {
                                $this.text(this.countNum);
                                //alert('finished');
                            }
                        });
                    });
                    counted = 1;
                }
            });
        },
        pt_moving_button = function() {
            var strength = (jQuery('.elementor-widget-Popup_video').height() - 150);
            // console.log(strength);
            var magnets = document.querySelectorAll('.pt-moving-button');
            magnets.forEach((magnet) => {
                magnet.addEventListener('mousemove', moveMagnet);
                magnet.addEventListener('mouseout', function(event) {
                    TweenMax.to(event.currentTarget, 1, {
                        x: 0,
                        y: 0,
                        ease: Power4.easeOut
                    });
                });
            });

            function moveMagnet(event) {
                var magnetButton = event.currentTarget;
                var bounding = magnetButton.getBoundingClientRect();
                TweenMax.to(magnetButton, 1, {
                    x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * strength,
                    y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * strength,
                    ease: Power4.easeOut
                });
            }
        },
        card = function() {
            const {
                ScrollObserver,
                valueAtPercentage
            } = aat
            const cardsContainer = document.querySelector('.pt-cards')
            const cards = document.querySelectorAll('.pt-card')
            cardsContainer.style.setProperty('--cards-count', cards.length - 3)
            cardsContainer.style.setProperty(
                '--card-height',
                `${cards[0].clientHeight}px`
            )
            Array.from(cards).forEach((card, index) => {
                const offsetTop = 20 + index * 20
                card.style.paddingTop = `${offsetTop}px`
                if (index === cards.length - 1) {
                    return
                }
                const toScale = 1 - (cards.length - 1 - index) * 0.05
                const nextCard = cards[index + 1]
                const cardInner = card.querySelector('.pt-card-inner')
                ScrollObserver.Element(nextCard, {
                    offsetTop,
                    offsetBottom: window.innerHeight - card.clientHeight
                }).onScroll(({
                    percentageY
                }) => {
                    cardInner.style.scale = valueAtPercentage({
                        from: 1,
                        to: toScale,
                        percentage: percentageY
                    })
                    cardInner.style.filter = `brightness(${valueAtPercentage({
					from: 1,
					to: 0.6,
					percentage: percentageY
				})})`
                })
            })
        },
        isScrolledIntoView = function(elem) {
            var docViewTop = jQuery(window).scrollTop();
            var docViewBottom = docViewTop + jQuery(window).height();
            var elemTop = jQuery(elem).offset().top;
            var elemBottom = elemTop + jQuery(elem).height();
            return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        accordion = function() {
            jQuery(".pt-accordion-box:first").addClass("pt-ad-list-active");
            jQuery(".pt-ad-list:first .pt-list").show();
            jQuery(".pt-active-button").on("click", function() {
                var parent = jQuery(this).parent();
                parent.find(".pt-list").slideToggle(500);
                parent.toggleClass("pt-ad-list-active");
                parent.siblings().removeClass("pt-ad-list-active");
                parent.siblings().find(".pt-list").slideUp(500);
            });
        };
    jQuery(document).ready(function() {
        registerDependencies();
        if (jQuery('.timer').length > 0) {
            asyncloader.require(['jquery.countTo'], function() {
                timer();
            });
        }
        if (jQuery('.pt-masonry , .pt-grid ').length > 0) {
            asyncloader.require(['isotope.pkgd'], function() {
                isotope();
            });
        }
        if (jQuery('.owl-carousel').length > 0) {
            asyncloader.require(['owl.carousel'], function() {
                owl_carousel();
            });
        }
        if (jQuery('.pt-swiper-timeline').length > 0) {
            new_timeline();
        }
        if (jQuery('.pt-accordion-block').length > 0) {
            accordion();
        }
        if (jQuery('.pt-cards').length > 0) {
            card();
        }
        if (jQuery('.pt-moving-button').length > 0) {
            // console.log('in');
            pt_moving_button();
        }
        if (jQuery('.pt-service-box.pt-style-1').length > 0) {
            award_image_effect();
        }
        if (jQuery('.pt-process-step').length > 0) {
            process_step_effect();
        }
        if (jQuery('.popup-youtube, .popup-vimeo, .popup-gmaps, .button-play').length > 0) {
            asyncloader.require(['jquery.magnific-popup'], function() {
                pop_video();
            });
        }
        if (jQuery('.pt-counter-info').length > 0) {
            counter();
        }
        if (jQuery('.slick-slider-main').length > 0) {
            slick_slider();
        }
        if (jQuery('.pt-progressbar-box').length > 0) {
            asyncloader.require(['progressbar.js'], function() {
                progress_bar();
            });
        }
        if (jQuery('.pt-circle-progress-bar').length > 0) {
            asyncloader.require(['circle-progress'], function() {
                circle_progress();
            });
        }
        jQuery('p:empty').remove();
        // isScrolledIntoView = function (elem) {
        // 	var docViewTop = jQuery(window).scrollTop();
        // 	var docViewBottom = docViewTop + jQuery(window).height();
        // 	var elemTop = jQuery(elem).offset().top;
        // 	var elemBottom = elemTop + jQuery(elem).height();
        // 	console.log("docViewTop:", docViewTop);
        // 	console.log("docViewBottom:", docViewBottom);
        // 	console.log("elemTop:", elemTop);
        // 	console.log("elemBottom:", elemBottom);
        // 	return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        // };
        // jQuery(".pt-process-step").each(function () {
        // 	var $this = jQuery(this);
        // 	console.log(this);
        // 	jQuery(window).scroll(function () {
        // 		var top_of_element = jQuery(".pt-process-step").offset().top;
        // 		var bottom_of_element = jQuery(".pt-process-step").offset().top + jQuery(".pt-process-step").outerHeight();
        // 		var bottom_of_screen = jQuery(window).scrollTop() + jQuery(window).innerHeight();
        // 		var top_of_screen = jQuery(window).scrollTop();
        // 		// console.log(jQuery($this));
        // 		if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)) {
        // 			console.log(jQuery($this).addClass('pt-active'));
        // 		} else {
        // 			console.log(jQuery($this).removeClass('pt-active'));
        // 		}
        // 	});
        // });
    });
})(jQuery);