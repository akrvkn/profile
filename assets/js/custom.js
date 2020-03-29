/******** Youtube background ********/
/* Youtube Vars---------------------------------------------------------------*/

//vqqt5p0q-eU
//var yt_video = "8Y8kEExXDNs";

var yt_video = "vqqt5p0q-eU";

var v_start = 0;

var tag,
	tv,
	vid,
	randomVid,
	currVid,
	firstScriptTag,
	createdVideoDiv,
	ytLoaded = 0,
	playerDefaults = {
		autoplay: 1,
		autohide: 1,
		modestbranding: 0,
		rel: 0,
		showinfo: 0,
		controls: 0,
		disablekb: 1,
		enablejsapi: 0,
		iv_load_policy: 3
	};

var videoStartTime,
	videoEndTime;
if(typeof v_start !== "number")
	videoStartTime = 1;
else
	videoStartTime = v_start;
if(typeof v_end !== "number")
	videoEndTime = 999999;
else
	videoEndTime = v_end;

if(typeof yt_video !== "undefined"){
	if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
		tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/player_api';
		firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
		vid = [
			{'videoId': yt_video, 'startSeconds': videoStartTime, 'endSeconds': videoEndTime, 'suggestedQuality': 'default'}
		];
		randomVid = Math.floor(Math.random() * vid.length);
		currVid = randomVid;
	}
}

/* Youtube Hero Video Functions ----------------------------------------------*/

function onYouTubePlayerAPIReady(){
	var initPlayer = setInterval(function(){
		if(createdVideoDiv===1){
			tv = new YT.Player('tv', {events: {'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange}, playerVars: playerDefaults});
			clearInterval(initPlayer);
		}
	},200);
}

function onPlayerReady(){
	tv.loadVideoById(vid[currVid]);
	tv.mute();
	ytLoaded = 1;
}

function onPlayerStateChange(e) {
	if (e.data === 1){
		$('#tv').addClass('active');
	}
	else if (e.data === 2){
		$('#tv').removeClass('active');
		if(currVid === vid.length - 1){
			currVid = 0;
		}
		else {
			currVid++;
		}
		tv.loadVideoById(vid[currVid]);
		tv.seekTo(vid[currVid].startSeconds);
	}
	if (e.data === YT.PlayerState.ENDED) {
		$(".hero-video").css("opacity","0.01");
		$(".hero-video").stop().animate({opacity:1},{duration:6000});
		tv.playVideo();
	}
}

(function(){

	'use strict';

	$(function(){

		if(typeof yt_video !== "undefined"){
			if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
				addHeroVideo();
				$(".hero-video").append('<div class="screen mute" id="tv"></div>');
				$(".hero-video").css({opacity:0});
				createdVideoDiv=1;
			}
		}

		setHeroVideo();

		$(window).on("resize", function () {
			setHeroVideo();
		});

		function isMobile(){
			var isMobile = ('ontouchstart' in document.documentElement || navigator.userAgent.match(/Mobi/)?true:false);
			return isMobile;
		}

		function addHeroVideo(){
			$(".hero-header").each(function(){
				if($(this).hasClass("h-video")){
					$(this).prepend('<div class="hero-video"></div>');
				}
			});
		}

		function setHeroVideo(){
			if($(".h-video").length && !isMobile()){
				/* To local Hero Video */
				if(typeof local_video!=="undefined"){
					if(local_video!==undefined && local_video!=="" && local_video!==" "){
						$(".hero-video").remove();
						$(".hero-video").each(function(){
							$(this)[0].parentNode.removeChild($(this)[0]);
						});
						$(".hero-header").each(function(){
							if($(this).hasClass("h-video")){
								addHeroVideo();
								$(".hero-video").css({opacity:1}).append('<div id="video-container"><video id="background_video" loop muted></video><div id="video_cover"></div>');
								var bv = new Bideo();
								bv.init({
									videoEl: document.querySelector('#background_video'),
									container: document.querySelector('.hero-video'),
									resize: true,
									isMobile: isMobile(),
									src: local_video
								});
							}
						});
						$('#video_cover').css({opacity:0});
						if($('#video-container').css("opacity")==="0"){
							$('#video-container').css("opacity","0.01");
							$('#video-container').stop().delay(600).animate({opacity:1},{duration:3000});
						}
						checkPolifill();
						if(isMobile())
							$('#video_cover').css({display:"block"}).animate({opacity:1});
					}
				}
				/* To Youtube and Vimeo */
				videoRescale();
			}
		}

		function videoRescale(){
			ytVidRescale();
		}

		function ytVidRescale(){
			if(typeof yt_video !== "undefined"){
				if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
					var c = setInterval(function(){
						var w = $(".hero-video").width(),
							h = $(".hero-video").height();
						if (w/h > 16/9){
							if(tv!==undefined)
								tv.setSize(w, w/16*9);
							$('.hero-video .screen').css({'left': '0px'});
						}
						else {
							if(tv!==undefined)
								tv.setSize(h/9*16, h);
							$('.hero-video .screen').css({'left': -($('.hero-video .screen').outerWidth()-w)/2});
						}
						if(ytLoaded){
							if($(".hero-video").css("opacity")==="0"){
								$(".hero-video").css("opacity","0.01");
								$(".hero-video").stop().animate({opacity:1},{duration:6000});
							}
						}
					},1);
					setTimeout(function(){
						clearInterval(c);
					},4000);
				}
			}
		}

		/* Object Fit Polyfill to Background Videos ------------------------------*/

		var objectFitVideos = function () {
			var testImg                = new Image(),
				supportsObjectFit      = 'object-fit' in testImg.style,
				supportsObjectPosition = 'object-position' in testImg.style,
				propRegex              = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;
			if (!supportsObjectFit || !supportsObjectPosition) {
				initialize();
				throttle('resize', 'optimizedResize');
			}

			function getStyle ($el) {
				var style  = getComputedStyle($el).fontFamily,
					parsed = null,
					props  = {};
				while ((parsed = propRegex.exec(style)) !== null) {
					props[parsed[1]] = parsed[2];
				}
				if (props['object-position'])
					return parsePosition(props);
				return props;
			}

			function initialize () {
				var videos = document.querySelectorAll('video'),
					index  = -1;
				while (videos[++index]) {
					var style = getStyle(videos[index]);
					if (style['object-fit'] || style['object-position']) {
						style['object-fit'] = style['object-fit'] || 'fill';
						fitIt(videos[index], style);
					}
				}
			}

			function fitIt ($el, style) {
				if (style['object-fit'] === 'fill')
					return;
				var setCss = $el.style,
					getCss = window.getComputedStyle($el);
				var $wrap = document.createElement('object-fit');
				$wrap.appendChild($el.parentNode.replaceChild($wrap, $el));
				var wrapCss = {
					height:    '100%',
					width:     '100%',
					boxSizing: 'content-box',
					display:   'inline-block',
					overflow:  'hidden'
				};
				'backgroundColor backgroundImage borderColor borderStyle borderWidth bottom fontSize lineHeight left opacity margin position right top visibility'.replace(/\w+/g, function (key) {
					wrapCss[key] = getCss[key];
				});
				for (var key in wrapCss)
					$wrap.style[key] = wrapCss[key];
				setCss.border  = setCss.margin = setCss.padding = 0;
				setCss.display = 'block';
				setCss.opacity = 1;
				$el.addEventListener('loadedmetadata', doWork);
				window.addEventListener('optimizedResize', doWork);
				if ($el.readyState >= 1) {
					$el.removeEventListener('loadedmetadata', doWork);
					doWork();
				}

				function doWork () {
					var videoWidth  = $el.videoWidth,
						videoHeight = $el.videoHeight,
						videoRatio  = videoWidth / videoHeight;
					var wrapWidth  = $wrap.clientWidth,
						wrapHeight = $wrap.clientHeight,
						wrapRatio  = wrapWidth / wrapHeight;
					var newHeight = 0,
						newWidth  = 0;
					setCss.marginLeft = setCss.marginTop = 0;
					if (videoRatio < wrapRatio ?
						style['object-fit'] === 'contain' : style['object-fit'] === 'cover') {
						newHeight = wrapHeight * videoRatio;
						newWidth  = wrapWidth / videoRatio;
						setCss.width  = Math.round(newHeight) + 'px';
						setCss.height = wrapHeight + 'px';
						if (style['object-position-x'] === 'left')
							setCss.marginLeft = 0;
						else if (style['object-position-x'] === 'right')
							setCss.marginLeft = Math.round(wrapWidth - newHeight) + 'px';
						else
							setCss.marginLeft = Math.round((wrapWidth - newHeight) / 2) + 'px';
					}
					else {
						newWidth = wrapWidth / videoRatio;
						setCss.width     = wrapWidth + 'px';
						setCss.height    = Math.round(newWidth) + 'px';
						if (style['object-position-y'] === 'top')
							setCss.marginTop = 0;
						else if (style['object-position-y'] === 'bottom')
							setCss.marginTop = Math.round(wrapHeight - newWidth) + 'px';
						else
							setCss.marginTop = Math.round((wrapHeight - newWidth) / 2) + 'px';
					}
				}
			}

			function parsePosition (style) {
				if (~style['object-position'].indexOf('left'))
					style['object-position-x'] = 'left';
				else if (~style['object-position'].indexOf('right'))
					style['object-position-x'] = 'right';
				else
					style['object-position-x'] = 'center';
				if (~style['object-position'].indexOf('top'))
					style['object-position-y'] = 'top';
				else if (~style['object-position'].indexOf('bottom'))
					style['object-position-y'] = 'bottom';
				else
					style['object-position-y'] = 'center';
				return style;
			}

			function throttle (type, name, obj) {
				obj = obj || window;
				var running = false,
					evt     = null;
				try {
					evt = new CustomEvent(name);
				} catch (e) {
					evt = document.createEvent('Event');
					evt.initEvent(name, true, true);
				}
				var func = function () {
					if (running) return;
					running = true;
					requestAnimationFrame(function () {
						obj.dispatchEvent(evt);
						running = false;
					});
				};
				obj.addEventListener(type, func);
			}
		};

		function checkPolifill(){
			if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
				module.exports = objectFitVideos;
			setTimeout(function(){
				if($("#background_video").length){
					objectFitVideos();
					$('#background_video').get(0).play();
				}
			},1500);
		}

	});

})();

/******** End youtube background ********/



jQuery(document).ready(function() {
	
	"use strict";


	/******* Youtube section **********/

	var ytK="";


	$.getJSON("assets/js/config.json", function(res){
		if($(".video-caption").length){
			$(".video-caption h1").html(res.blogTitle);
			$(".video-caption div").html(res.blogSubTitle);
			$(".copyright a").html(res.blogTitle);
			$("head title").html(res.blogTitle);
			loadVids(res.playlist);


			//ytK= atob(res.youtubeAPI);
			//initYouTubePlayer(ytK);
			/*$.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?playlistId=PL9Ydusn_dJ1K3EKb9NgKQ2qoDV-hREy7n&part=snippet&key=" + ytK, function(res){
				$.each(res.items, function(k, v){
					console.log(v.snippet.resourceId.videoId);
				});
			});*/
		}
	});
	function loadVids(data) {
		//$.getJSON(URL, options, function (data) {
			var id = data[0].id;
			mainVid(id);
			resultsLoop(data);
			var owlVideoThumb = $("#video-thumb");
			owlVideoThumb.owlCarousel({
				dots: true,
				responsiveClass: true,
				responsive:{
					0:{
						items:2
					},
					720:{
						items:2
					},
					768:{
						items:2
					},
					960:{
						items:2
					},
					1024:{
						items:3
					}
				}
			});
		//});

function initYouTubePlayer(key) {
	var playlistId = 'PL9Ydusn_dJ1K3EKb9NgKQ2qoDV-hREy7n';
	var URL = 'https://www.googleapis.com/youtube/v3/playlistItems';


	var options = {
		part: 'snippet',
		key: key,
		maxResults: 5,
		rel: 0,
		showinfo: 0,
		modestbranding: 1,
		playlistId: playlistId
	};

	//loadVids();

	/*function loadVids() {
		$.getJSON(URL, options, function (data) {
			var id = data.items[0].snippet.resourceId.videoId;
			mainVid(id);
			resultsLoop(data);
			var owlVideoThumb = $("#video-thumb");
			owlVideoThumb.owlCarousel({
				dots: true,
				responsiveClass: true,
				responsive:{
					0:{
						items:2
					},
					720:{
						items:2
					},
					768:{
						items:2
					},
					960:{
						items:2
					},
					1024:{
						items:4
					}
				}
			});
		});*/
	}

	function mainVid(id) {
		$('#video-main').html(`
				<iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?list=${id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
			`);
	}


	/*function resultsLoop(data) {

		$.each(data.items, function (i, item) {

			var thumb = item.snippet.thumbnails.medium.url;
			var title = item.snippet.title;
			var desc = item.snippet.description.substring(0, 100);
			var vid = item.snippet.resourceId.videoId;


			$('.videothumb').append(`
						<div class="carousel-item" data-key="${vid}" style="margin-top: 585px">
                            <div class="carousel-inner">
                                <figure>
                                    <img src="${thumb}" />
                                </figure>
                                <div class="content-block-detail">
                                   
                                    <h3">${title}</h3>
                                    <!--<div class="item-list-description">${desc}</div>-->
                                </div>                        
                            </div>
                        </div>
					`);
		});
	}*/

	function resultsLoop(data) {

		$.each(data, function (i, item) {
			$('#video-thumb').append(`
						<div class="carousel-item" data-key="${item.id}">
                            <div class="carousel-inner">
                                <iframe width="100%" height="100%"  src="https://www.youtube.com/embed/videoseries?list=${item.id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                <div class="content-block-detail">                                  
                                    <h3">${item.title}</h3>                                
                                </div>                        
                            </div>
                        </div>
					`);
		});
	}

	// CLICK EVENT
	$('#video-thumb').on('click', '.carousel-item', function () {
		var id = $(this).attr('data-key');
		mainVid(id);
	});
}

	/**
	 * Instagram API
	 */

	function createPhotoElement(k, photo) {

		var innerHtml = $('<img>')
			.attr('src', photo.images.thumbnail.url);
		var thumbHover = $('<span>')
			.addClass('thumbnail-hover');

		innerHtml = $('<a>')
			.attr('href', '#portfolio-tabs-' + k)
			.append(thumbHover)
			.append(innerHtml);

		return $('<li>')
			.append(innerHtml);
	}

	function createPhotoBig(k, photo) {
		//console.log(photo);
		var tags = photo.tags.length === 0 ? '#' + photo.user.username : photo.tags.toString().replace(',', '#');
		return `<div id="portfolio-tabs-${k}" class="portfolio-tabs">
                    <figure class="portfolio-tabs-img">
                        <img src="${photo.images.standard_resolution.url}" width="640" height="640" alt="portfolio" />
                    </figure>
                    <section class="portfolio-tabs-detail">
                        <h2>${tags}</h2>
                        <div class="item-list-description">${photo.caption.text}</div>
                        <div class="button raised dark-grey ripple">
                            <a href="#">Открыть</a>
                        </div>
                    </section>
                </div>`;
	}

	function didLoadInstagram(event, response) {
		//var that = this;
		$.each(response.data, function(i, photo) {
			var k = i + 1;
			$('.portfolio-tabs-list').append(createPhotoElement(k, photo));
			$('.portfolio-detail-wrapper').append(createPhotoBig(k, photo));
			if(i === 8){
				$('#portfolioTabs').tabulous({
					effect: 'slideUp' //** This Template use effect slideUp only for the proper design.
				});
			}
		});
	}

	$(document).ready(function() {

		/*$('#portfolioTabs').on('didLoadInstagram', didLoadInstagram);
		$('#portfolioTabs').instagram({
			count: 9,
			userId: 314046394,
			accessToken: '314046394.673793e.88345306c6d54356a699021df0503000'
		});*/

	});

	/****** Twitter API Widget *********/

	twttr.events.bind(
		'loaded',
		function (event) {
			event.widgets.forEach(function (widget) {
				//console.log($('#' + widget.id).contents().find('ol li .timeline-Tweet-text').text());
				//console.log("Created widget", widget.id);
				$.each($('#' + widget.id).contents().find('ol li.timeline-TweetList-tweet'), function(i, v){
					var text = $(v).find('.timeline-Tweet-text').text();
					var media = $(v).find('.NaturalImage-image').attr('src');
					var time = $(v).find('time').text();
					var link = $(v).find('a.timeline-Tweet-timestamp').attr('href');
					var name = $(v).find('.tweetAuthor-name').text();
					$('#twitterBlog').append(createTwitterBlogItem(text, media, time, link, name));
					var owlBlog = $(".home-blog-panel .box-carousel-wrapper");
					if(i === 2){
						owlBlog.owlCarousel({
							dots: false,
							responsiveClass: true,
							responsive:{
								0:{
									items:1
								},
								720:{
									items:2
								},
								768:{
									items:2
								},
								960:{
									items:3
								},
								1024:{
									items:3
								}
							}
						});
					}
					//console.log(text, media, time, link, name);
				});
			});
		}
	);

	function createTwitterBlogItem(txt, pic, time, link, name){
		//var img = `<figure><img src="assets/images/upload/home-blog-panel-thumbnail1.jpg" alt="thumbnail" /></figure>`;
		var	img = pic === undefined ? '' : `<figure><img src="${pic}" style="width: 370px; height: 270px;" alt="thumbnail" /></figure>`;

		return `<div class="carousel-item">
					<div class="carousel-inner">
						${img}
						<div class="content-block-detail">                            
							<h3>${name}</h3>
							<div class="item-list-description">${txt.replace(/http.*?\s/g, '')}</div>
						</div>
						<div class="blog-meta number">
							<ul>
								<li><a href="${link}">${time}</a></li>                    
							</ul>
						</div>
					</div>
				</div>`;
	}



	// ===== Pre Loader ===== //
	$(window).on("load", function(){
		$('.loader-wrapper').fadeOut(300);
		$('#main-menu').fadeIn(300);
	});
	
	
	// ===== Custom Data Attribute ===== //
	var bgImage = "#fullpage .section, #fullpage .section .slide, .slider-panel-wrapper .slides li, .full-carousel-wrapper .carousel-item, .page-header, .page-footer, .page-team, .myVideo"
	
	$("*").css('height', function () {
		var heightAttr = $(this).attr('data-height')+'px';
		return heightAttr;
	});
	
	$("*").css('color', function () {
		var colorAttr = $(this).data('color');
		return colorAttr;
	});
	
	$("*").css('opacity', function () {
		var opacityAttr = $(this).data('opacity');
		return opacityAttr;
	});
	
	$("*").css('background-color', function () {
		var bgcolorAttr = $(this).data('bg-color');
		return bgcolorAttr;
	});
	
	$(bgImage).css('background-image', function () {
		var bg = ('url(' + $(this).data("image-src") + ')');
		return bg;
	});
	
	$(".top-triangle").css("border-bottom-color", function () {
		var topTriangle = $(this).data('shape-color');
		return topTriangle;
	});
	
	
	// ===== Add class to Text Number ===== //
	$('.number').html(function(i, v){
		return v.replace(/(\d)/g, '<span class="font-number">$1</span>');
	});
	
	
	// ===== Block Title Before After ===== //
	$('.block-title h1').before('<div class="line-before"></div>').after('<div class="line-after"></div>').wrapInner('<span></span>');
	
	$(window).on("load resize", function() {
		$('.block-title h1').each(function() {
			var titleText = $(this).children().width();
			$(this).width(titleText);
		});
	});
	
	
	// ===== Fit Image to DIV ===== //
	$('.fit-img').each(function() {
		var $div = $(this),
			$img = $('img', $div),
			src = $img.attr('src');
			$div.css('backgroundImage', 'url(' + src + ')');
			$img.remove();
	});
	
	
	// ===== More Item Link Position Settings ===== //
	$(window).on("load resize", function() {
		var wHeight = $(window).height();
		var cHeight = $('.group-wrapper').height();
		
		if ( cHeight > wHeight - 60 ) {
			$('.more-item-link').css({ 'position' : 'relative' });
		} else {
			$('.more-item-link').css({ 'position' : 'absolute' });
		}
	});
	
	
	// ===== jQuery SlimScroll Settings ===== //
	var buildScroll = $('.nav-inner-wrap, .container-wrapper');
	var destroyScroll = $('');
	
	destroyScroll.slimScroll({  // ===== CHANGE 'destroyScroll' TO 'buildScroll' WHEN YOU USING AUTO SCROLLING FUNCTION ===== //
		position: 'right'
	});
	
	
	// ===== Load Progress Bar When Scroll To Element ===== //
	var progressBar = ".progress-bar-wrapper:in-viewport";
	
	function loadDaBars() {
		$('.progress-bar').css('width',  function() {
			return ($(this).attr('data-percentage')+'%')
		});
		
		$('.progress-title').css('opacity', '1');
	}
	
	$('.container-wrapper').on("scroll", function(){
		$(progressBar).each(function(){
			loadDaBars();
		});
	});
	
	
	// ===== Animation Settings ===== //
	var animateFadeIn = ".animate-fadeIn:in-viewport";
	var animateFadeInUp = ".animate-fadeInUp:in-viewport";
	var animateFadeInDown = ".animate-fadeInDown:in-viewport";
	var animateFadeInLeft = ".animate-fadeInLeft:in-viewport";
	var animateFadeInRight = ".animate-fadeInRight:in-viewport";
	
	$(animateFadeIn).each(function(){
		$(animateFadeIn).delay(300).animate({ opacity: 1 }, 2000, 'easeOutExpo');
	});
	$(animateFadeInUp).each(function(){
		$(animateFadeInUp).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
	});
	$(animateFadeInDown).each(function(){
		$(animateFadeInDown).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
	});
	$(animateFadeInLeft).each(function(){
		$(animateFadeInLeft).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
	});
	$(animateFadeInRight).each(function(){
		$(animateFadeInRight).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
	});
	
	$('.container-wrapper').on("scroll", function(){
		$(animateFadeIn).each(function(){
			$(animateFadeIn).delay(300).animate({ opacity: 1 }, 2000, 'easeOutExpo');
		});
		$(animateFadeInUp).each(function(){
			$(animateFadeInUp).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
		});
		$(animateFadeInDown).each(function(){
			$(animateFadeInDown).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
		});
		$(animateFadeInLeft).each(function(){
			$(animateFadeInLeft).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
		});
		$(animateFadeInRight).each(function(){
			$(animateFadeInRight).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
		});
	});
	
	
	// ===== Ripple Effect Settings ===== //
	$(".ripple").on("click", function(e){
		var x = e.pageX;
		var y = e.pageY;
		var clickY = y - $(this).offset().top;
		var clickX = x - $(this).offset().left;
		var box = this;
		   
		var setX = parseInt(clickX,10);
		var setY = parseInt(clickY,10);
		$(this).find("svg").remove();
		$(this).append('<svg><circle cx="'+setX+'" cy="'+setY+'" r="'+0+'"></circle></svg>');

		var c = $(box).find("circle");
		c.animate(
			{
				"r" : $(box).outerWidth()
			},
			{
				easing: "easeOutQuad",
				duration: 400,
				step : function(val){
					c.attr("r", val);
				}
			}
		);
		  
		$('svg').fadeOut(1000);
		  
	});
	
	
	// ===== Hide Elements On Small Devices ===== //
	if (navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/) || 
		navigator.userAgent.match(/Windows Phone/i) || 
		navigator.userAgent.match(/ZuneWP7/i)
		) {
			$('.myVideo video').hide();
			$('#fullpage .section, #fullpage .section .slide').css('min-height', '0px');
		}
	
	
	// ===== Navigation Menu Settings ===== //
	// Append Click Navigation Menu
	$("#main-menu .nav-menu li:has(ul)").each(function(){
		$(this).append( "<span></span>" );
		$(this).addClass("dropdown-menu");
	});
	
	// Navigation Menu Toggle
	$('.dropdown-menu ul').hide();
	$("#main-menu .nav-menu li span").on("click", function(){
		$(this).prev("ul").slideToggle(300);
	});
	
	
	// ===== jQuery Sidebar Navigation Settings ===== //
    var sides = ["left", "right"];
	
	// Defines Menu Position
	if ( $("#main-menu").hasClass("right") ) {
		$(".nav-btn").attr("data-side", "right");
		$('.sidebar-nav').addClass("right");
	} else {
		$(".nav-btn").attr("data-side", "left");
		$('.sidebar-nav').addClass("left");
	}
	
    // Initialize sidebars
    for (var i = 0; i < sides.length; ++i) {
        var cSide = sides[i];
        $(".sidebar-nav." + cSide).sidebar({
			side: cSide
		});
    }
		
    // Click handlers
    $(".nav-btn[data-action]").on("click", function () {
        var $this = $(this);
        var action = $this.attr("data-action");
        var side = $this.attr("data-side");
        $(".sidebar-nav." + side).trigger("sidebar:" + action);
        return false;
    });
	
	$(".nav-menu li a").on("click", function () {
        $(".sidebar-nav").trigger("sidebar:close");
		$('.dropdown-menu ul').hide(300);
    });
	
	// Fixed Menu Overflow on iOS
	if (navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i)
		) {
			$('#main-menu .nav-menu').css( { "margin-bottom" : "100px" } );
		}
	
	
	// ===== jQuery FitVids Settings ===== //
	$(".video-wrapper").fitVids();
	
	
	// ===== OWL Carousel Setting ===== //
	// Services Panel Style 3
	var owlFullService = $(".services-panel3 .full-carousel-wrapper");
	owlFullService.owlCarousel({
		dots: false,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:1
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1024:{
				items:3
			}
		}
	});
	
	// Content Block Style 2
	var owlFullContent = $(".content-block2 .full-carousel-wrapper");
	owlFullContent.owlCarousel({
		dots: false,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:2
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1200:{
				items:4
			}
		}
	});
	
	// Portfolio Panel Style 2
	var owlPortfolio = $(".portfolio-panel2 .full-carousel-wrapper");
	owlPortfolio.owlCarousel({
		dots: false,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:2
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1200:{
				items:4
			}
		}
	});
	
	// Portfolio Single Page
	var owlPortfolioSingle = $(".related-work .owl-carousel");
	owlPortfolioSingle.owlCarousel({
		dots: false,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			480:{
				items:2
			},
			768:{
				items:3
			},
			960:{
				items:4
			},
			1200:{
				items:5
			}
		}
	});
	
	// Custom Navigation
	$(".btn.next").on("click", function(){
		owlFullService.trigger('next.owl.carousel', [500]);
		owlFullContent.trigger('next.owl.carousel', [500]);
		owlPortfolio.trigger('next.owl.carousel', [500]);
		owlPortfolioSingle.trigger('next.owl.carousel', [500]);
	})
	$(".btn.prev").on("click", function(){
		owlFullService.trigger('prev.owl.carousel', [500]);
		owlFullContent.trigger('prev.owl.carousel', [500]);
		owlPortfolio.trigger('prev.owl.carousel', [500]);
		owlPortfolioSingle.trigger('prev.owl.carousel', [500]);
	})
	
	// Carousel Inner Vertical Middle
	$(window).on("load resize", function() {
		var carouselTitle = $('.carousel-inner.title')
		var titleHeight = $('.carousel-block-title').height();
		var carouselItem = $('.carousel-inner.item');
		var itemHeight = carouselItem.height();
		carouselTitle.each(function(){
			$(this).css('margin-top', - titleHeight / 2);
		});
		carouselItem.each(function(){
			$(this).css('margin-top', - itemHeight / 2);
		});
	});
	
	// Content Block Style 1
	var owlBlock = $(".content-block1 .box-carousel-wrapper");
	owlBlock.owlCarousel({
		dots: true,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:2
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1024:{
				items:4
			}
		}
	});
	
	// Home Blog Panel
	/*var owlBlog = $(".home-blog-panel .box-carousel-wrapper");
	owlBlog.owlCarousel({
		dots: true,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:2
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1024:{
				items:3
			}
		}
	});*/
	
	// Home Team Panel and Page Team Section
	var owlTeam = $(".home-team-panel .box-carousel-wrapper, .page-team .box-carousel-wrapper");
	owlTeam.owlCarousel({
		dots: true,
		responsiveClass: true,
		responsive:{
			0:{
				items:1
			},
			720:{
				items:2
			},
			768:{
				items:2
			},
			960:{
				items:3
			},
			1024:{
				items:3
			}
		}
	});
	
	
	// ===== jQuery FlexSlider Settings ===== //
	$(window).on("load", function() {
		$('.flexslider.slider-panel-wrapper').flexslider({
			controlNav: false,
			directionNav: false,
			slideshow: true,
			animationSpeed: 800,
			multipleKeyboard: true,
			pauseOnHover: true
		});
		
		$('.featured-area .flexslider').flexslider({
			controlNav: false,
			directionNav: false,
			slideshow: true,
			animationSpeed: 800,
			multipleKeyboard: true,
			pauseOnHover: true
		});
		
		// Homepage slider custom navigation
		$('.section .slide-prev.prev, .section .slide-next.next').on('click', function(){
			$(".section").removeClass("addcustomNav");
			$(this).parents(".section").addClass("addcustomNav");
			
			var href = $(this).attr('href');
			$('.addcustomNav .flexslider').flexslider(href)
			return false;
		});
		
		// Single page slider custom navigation
		$('.page-header-featured .slide-prev.prev, .page-header-featured .slide-next.next').on('click', function(){
			var href = $(this).attr('href');
			$('.page-header-featured .flexslider').flexslider(href)
			return false;
		});
	});
	
	// Fit Height Elements
	$(window).on("load resize", function() {
		var fitHeight = $(window).height();
		var slideHeight = $('.slider-panel-wrapper .slides li');
		slideHeight.height(fitHeight);
	});
	
	
	// ===== jQuery Megafolio Settings ===== //
	var api=jQuery('.portfolio-panel1 .megafolio-container').megafoliopro({
		filterChangeAnimation: "pagemiddle",
		filterChangeSpeed: 800,
		paddingHorizontal: 0,
		paddingVertical: 0,
		layoutarray: [8]
	});
	
	var portfolioPage=jQuery('.portfolio-page .megafolio-container').megafoliopro({
		filterChangeAnimation: "pagemiddle",
		filterChangeSpeed: 800,
		paddingHorizontal: 0,
		paddingVertical: 0,
		layoutarray: [8]
	});
	
	// CALL FILTER FUNCTION IF ANY FILTER HAS BEEN CLICKED
    jQuery('.filter').on("click", function() {
		jQuery('.filter').each(function() {
			jQuery(this).removeClass("selected")
		});
		api.megafilter(jQuery(this).data('category'));
		portfolioPage.megafilter(jQuery(this).data('category'));
		jQuery(this).addClass("selected");
    });
	
	
	// ===== FancyBox Settings ===== //
	$(".fancybox").fancybox({
		//padding: 0
	});
	
	// ===== Change burger menu background-color on the fly with Midnight jQuery ===== //
	$('.nav-open').midnight();
	
	// ===== jQuery Fullpage Settings ===== //
	var customScroll = false;  // ===== CHANGE THIS VARIABLE TO 'true' IF YOU NEED TO USE AUTO SCROLLING FUNCTION ===== //
	
	if (customScroll == false) {
		$('#fullpage').addClass("normalScroll");
	}
	
	$('#fullpage').fullpage({
		autoScrolling: customScroll,
		scrollOverflow: customScroll,
		resize: false,
		anchors: ['panelBlock1', 'panelBlock2', 'panelBlock3', 'panelBlock4', 'panelBlock5', 'panelBlock6', 'panelBlock7', 'panelBlock8'],
		menu: '.nav-menu',
		navigation: true,
		navigationPosition: 'right',
		slidesNavigation: true,
		loopHorizontal: true,
		//responsive: 900,
		afterLoad: function(anchorLink, index){
			if(index == 2){
				$('.panel-2 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-2 .animate-fadeInUp, .panel-2 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-2 .animate-fadeInLeft, .panel-2 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 3){
				$('.panel-3 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-3 .animate-fadeInUp, .panel-3 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-3 .animate-fadeInLeft, .panel-3 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 4){
				$('.panel-4 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-4 .animate-fadeInUp, .panel-4 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-4 .animate-fadeInLeft, .panel-4 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 5){
				$('.panel-5 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-5 .animate-fadeInUp, .panel-5 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-5 .animate-fadeInLeft, .panel-5 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 6){
				$('.panel-6 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-6 .animate-fadeInUp, .panel-6 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-6 .animate-fadeInLeft, .panel-6 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 7){
				$('.panel-7 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-7 .animate-fadeInUp, .panel-7 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-7 .animate-fadeInLeft, .panel-7 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 8){
				$('.panel-8 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-8 .animate-fadeInUp, .panel-8 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-8 .animate-fadeInLeft, .panel-8 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 9){
				$('.panel-9 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-9 .animate-fadeInUp, .panel-9 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-9 .animate-fadeInLeft, .panel-9 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
			if(index == 10){
				$('.panel-10 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-10 .animate-fadeInUp, .panel-10 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$('.panel-10 .animate-fadeInLeft, .panel-10 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
				$(progressBar).each(function(){
					loadDaBars();
				});
			}
		}
	});
	
	// Move down mouse icon
	$('#moveSectionDown').on("click", function(e){
		e.preventDefault();
		$.fn.fullpage.moveSectionDown();
	});
	
	// Fixed to Fit to Section
	$(window).on("load resize", function() {
		var fullPageContainer = $('#fullpage');
		
		if (fullPageContainer.hasClass("normalScroll")) {
			fullPageContainer.addClass("addNormalScroll");
			fullPageContainer.removeClass("addAutoScroll");
		} else {
			fullPageContainer.addClass("addAutoScroll");
			fullPageContainer.removeClass("addNormalScroll");
		}
	});
	
	$(window).on("load", function() {
		setTimeout(function(){
			var fullPageContainer = $('#fullpage');
			var value =  window.location.hash.replace('#', '').split('/');
			var destiny = value[0];
			var section = $('[data-anchor="'+destiny+'"]');
			if(section.length === 0){
				section = $('.panel-1');
			}
			if (fullPageContainer.hasClass("addAutoScroll")) {
				$.fn.fullpage.reBuild();
			}
			if (fullPageContainer.hasClass("addNormalScroll")) {
				$('html, body').scrollTop(section.position().top);
			}
		}, 1000);
	});
	
	
	// ===== Services Tooltip Settings ===== //
	$('.service-tooltip').tooltipster({
		position: 'top',
		animation: 'grow',
		delay: 200,
		speed: 350,
		theme: 'tooltipster-shadow',
		touchDevices: true,
		trigger: 'hover',
		maxWidth: 228,
		offsetX: 0,
		offsetY: 10
	});
	
	
	// ===== Portfolio Tabs Settings ===== //
	/*$('#portfolioTabs').tabulous({
		effect: 'slideUp' //** This Template use effect slideUp only for the proper design.
	});*/
	
	// Fix Auto Height tabs_container
	$(window).on("load resize", function() {
		var pHeight = $('.portfolio-panel3 .portfolio-detail-wrapper');
		var ptHeight = $('.portfolio-tabs').height();
		
		pHeight.height(ptHeight);
	});
	
	
	// ===== Form Submit Settings ===== //
	$("#submit_message").on("click", function() {
		$('#reply_message').removeClass();
		$('#reply_message').html('')
		var regEx = "";
				
		// validate Name
		var name = $("input#name").val();
		regEx=/^[A-Za-z .'-]+$/;
		if (name == "" || name == "Name"  || !regEx.test(name)) {
			$("input#name").val('');
			$("input#name").focus();
			return false;
		}
		
		// validate Email
		var email = $("input#email").val();
		regEx=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
		if (email == "" || email == "Email" || !regEx.test(email)) {
			$("input#email").val('');
			$("input#email").focus();
			return false;
		}
		
		// validate Subject
		var mysubject = $("input#mysubject").val();
		regEx=/^[A-Za-z0-9 .'-]+$/;
		if (mysubject == "" || mysubject == "Mysubject"  || !regEx.test(mysubject)) {
			$("input#mysubject").val('');
			$("input#mysubject").focus();
			return false;
		}
		
		// validate Message
		var mymessage = $("textarea#mymessage").val();
		if (mymessage == "" || mymessage == "Mymessage" || mymessage.length < 2) {
			$("textarea#mymessage").val('');
			$("textarea#mymessage").focus();
			return false;
		}
							
		var dataString = 'name='+ $("input#name").val() + '&email=' + $("input#email").val() + '&mysubject='+ $("input#mysubject").val() + '&mymessage=' + $("textarea#mymessage").val();
		
		$('.loading').fadeIn(500);
		
		// Send form data to mailer.php
		$.ajax({
			type: "POST",
			url: "mailer.php",
			data: dataString,
			success: function() {
				$('.loading').hide();
				$('#reply_message').addClass('list3');
				$('#reply_message').html("<span>Mail sent successfully</span>")
				.hide()
				.fadeIn(1500);
				$('#form_contact')[0].reset();
				}
			});
		return false;
	});
	
});