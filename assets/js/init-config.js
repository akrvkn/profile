var yt_video = "1";

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

var videoStartTime = 1,
    videoEndTime = 999999;

function initYoutubeBackground(video, start, end) {
    yt_video = video;
    videoStartTime = start;
    videoEndTime = end;
    if (typeof yt_video !== "undefined") {
        console.log(videoEndTime);
        if (yt_video !== undefined && yt_video !== "" && yt_video !== " ") {
            tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/player_api';
            firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            vid = [
                {
                    'videoId': yt_video,
                    'startSeconds': videoStartTime,
                    'endSeconds': videoEndTime,
                    'suggestedQuality': 'default'
                }
            ];
            randomVid = Math.floor(Math.random() * vid.length);
            currVid = randomVid;
        }
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
        var heroVideo = $(".hero-video");
        heroVideo.css("opacity","0.01");
        heroVideo.stop().animate({opacity:1},{duration:6000});
        tv.playVideo();
    }
}

(function(){

    'use strict';

    $(function(){

        if(typeof yt_video !== "undefined"){
            if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
                addHeroVideo();
                var heroVideo = $(".hero-video");
                heroVideo.append('<div class="screen mute" id="tv"></div>');
                heroVideo.css({opacity:0});
                createdVideoDiv=1;
            }
        }

        setHeroVideo();

        $(window).on("resize", function () {
            setHeroVideo();
        });

        function isMobile(){
            //var isMobile = ('ontouchstart' in document.documentElement || navigator.userAgent.match(/Mobi/)?true:false);
            return !!('ontouchstart' in document.documentElement || navigator.userAgent.match(/Mobi/));
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
                videoRescale();
            }
        }

        function videoRescale(){
            ytVidRescale();
            //vmVidRescale();
        }

        function ytVidRescale(){
            if(typeof yt_video !== "undefined"){
                if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
                    var c = setInterval(function(){
                        var heroVideo =  $(".hero-video");
                        var w = heroVideo.width(),
                            h = heroVideo.height();
                        if (w/h > 16/9){
                            if(tv!==undefined)
                                tv.setSize(w, w/16*9);
                            $('.hero-video .screen').css({'left': '0px'});
                        }
                        else {
                            if(tv!==undefined)
                                tv.setSize(h/9*16, h);
                            var heroScreen = $('.hero-video .screen');
                            heroScreen.css({'left': -(heroScreen.outerWidth()-w)/2});
                        }
                        if(ytLoaded){
                            if(heroVideo.css("opacity")==="0"){
                                heroVideo.css("opacity","0.01");
                                heroVideo.stop().animate({opacity:1},{duration:6000});
                            }
                        }
                    },1);
                    setTimeout(function(){
                        clearInterval(c);
                    },4000);
                }
            }
        }

    });

})();

function loadVids(data) {
    var id = data[0].id;
    mainVid(id);
    resultsLoop(data);
    var owlVideoThumb = $("#video-thumb");
    owlVideoThumb.owlCarousel({
        dots: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2
            },
            720: {
                items: 2
            },
            768: {
                items: 2
            },
            960: {
                items: 2
            },
            1024: {
                items: 3
            }
        }
    });
}


function mainVid(id) {
    $('#video-main').html(`
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/videoseries?list=${id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `);
}

function resultsLoop(data) {

    $.each(data, function (i, item) {
        $('#video-thumb').append(`
                    <div class="carousel-item" data-key="${item.id}">
                        <div class="carousel-inner">
                            <div class="youtube-thumb-overlay"></div>
                            <iframe width="100%" height="100%"  src="https://www.youtube.com/embed/videoseries?list=${item.id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
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


//TWITTER
window.twttr = (function (d,s,id) {
    var t, js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return; js=d.createElement(s); js.id=id;
    js.src="https://platform.twitter.com/widgets.js"; fjs.parentNode.insertBefore(js, fjs);
    return window.twttr || (t = { _e: [], ready: function(f){ t._e.push(f) } });
}(document, "script", "twitter-wjs"));

var twLoaded;

twttr.ready(
    function (twttr) {
        twttr.events.bind(
            'loaded',
            function (event) {
                twLoaded = 1;
                event.widgets.forEach(function (widget) {
                    parseTwitterData(widget.id);
                });
            });
    });

function parseTwitterData(id){
    $.each($('#' + id).contents().find('ol li.timeline-TweetList-tweet'), function (i, v) {
        var text = $(v).find('.timeline-Tweet-text').text();
        var media = $(v).find('.NaturalImage-image').attr('src');
        var time = $(v).find('time').text();
        var link = $(v).find('a.timeline-Tweet-timestamp').attr('href');
        var name = $(v).find('.tweetAuthor-name').text();

        $('#twitterBlog').append(createTwitterBlogItem(text, media, time, link, name));
        var owlBlog = $(".panel-twitter .box-carousel-wrapper");
        if (i === 2) {
            owlBlog.owlCarousel({
                dots: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    720: {
                        items: 2
                    },
                    768: {
                        items: 2
                    },
                    960: {
                        items: 3
                    },
                    1024: {
                        items: 3
                    }
                }
            });
        }
    });
}

function createTwitterBlogItem(txt, pic, time, link, name){
    //var img = `<figure><img src="assets/images/upload/panel-twitter-thumbnail1.jpg" alt="thumbnail" /></figure>`;
    var	img = pic === undefined ? '' : `<figure><a style="cursor: pointer" href="${link}"><img src="${pic}" style="width: 100%; height: 100%;" alt="thumbnail" /></a></figure>`;

    return `<div class="carousel-item">
					<div class="carousel-inner">
						${img}
						<div class="content-block-detail">                            
							<h3>${name}</h3>
							<div class="item-list-description">${txt.replace(/http.*?\s/g, '')}</div>
						</div>
						<div class="blog-meta number">
							<ul>
								<li><span><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg></span>&nbsp;<a href="${link}">${time}</a></li>                    
							</ul>
						</div>
					</div>
				</div>`;
}

/**
 * Instagram API
 */

function createPhotoElement(k, photo) {

    var innerHtml = $('<img src="" alt="img">')
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
        //var k = i + 1;
        $('.portfolio-tabs-list').append(createPhotoElement(i, photo));
        $('.portfolio-detail-wrapper').append(createPhotoBig(i, photo));
        if(i === response.data.length - 1){
            $('#instagramTabs').tabulous({
                effect: 'slideUp' //** This Template use effect slideUp only for the proper design.
            });
            setTabsHeight();
        }
    });
}

function initInstagramAPI(userID, accessToken){
    var tabs = $('#instagramTabs');
    tabs.on('didLoadInstagram', didLoadInstagram);
    tabs.instagram({
        count: 9,
        userId: userID,
        accessToken: accessToken
    });
}

function fitImg(){
    $('.fit-img').each(function() {
        var $div = $(this),
            $img = $('img', $div),
            src = $img.attr('src');
        $div.css('backgroundImage', 'url(' + src + ')');
        $img.remove();
    });
}

function initSectionHeaders(){
    // ===== Block Title Before After ===== //
    $('.block-title h1').before('<div class="line-before"></div>').after('<div class="line-after"></div>').wrapInner('<span></span>');

    $(window).on("load resize", function() {
        $('.block-title h1').each(function() {
            var titleText = $(this).children().width();
            $(this).width(titleText);
        });
    });
}

function buildMenu(items){
    var menu = $('.nav-menu').empty();
    items.forEach(function(item){
            menu.append(`<li data-menuanchor="panelBlock${item.id}"><a class="nav-link nav_item" href="${item.link}">${item.title}</a></li>`);
    });
}

function setDataBgColor() {
    $("*").css('background-color', function () {
        return $(this).data('bg-color');
    });
}

function setDataBackground() {
    var bgImage = "#fullpage .section"
    $(bgImage).css('background-image', function () {
        var bg = '';
        if(typeof  $(this).data("image-src") !== "undefined" ) {
            bg = ('url(' + $(this).data("image-src") + ')');
        }
        return bg;
    });
}

function setDataOpacity(){
    $("*").css('opacity', function () {
        return $(this).data('opacity');
    });
}

function setDataColors(){
    $("*").css('color', function () {
        return $(this).data('color');
    });
}

function setDataHeight(){
    $("*").css('height', function () {
        return $(this).attr('data-height') + 'px';
    });
}

function setTabsHeight(){
    var pHeight = $('.portfolio-detail-wrapper');
    var ptHeight = $('.portfolio-tabs').height();

    pHeight.height(ptHeight);
}

function initAnimations(){
    // ===== Animation Settings ===== //

    var animateFadeIn = ".animate-fadeIn:in-viewport";
    var animateFadeInUp = ".animate-fadeInUp:in-viewport";
    var animateFadeInDown = ".animate-fadeInDown:in-viewport";
    var animateFadeInLeft = ".animate-fadeInLeft:in-viewport";
    var animateFadeInRight = ".animate-fadeInRight:in-viewport";

    $(animateFadeIn).each(function () {
        $(this).delay(300).animate({opacity: 1}, 2000, 'easeOutExpo');
    });

    $(animateFadeInUp).each(function(){
        $(this).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
    });
    $(animateFadeInDown).each(function(){
        $(this).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
    });
    $(animateFadeInLeft).each(function(){
        $(this).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
    });
    $(animateFadeInRight).each(function(){
        $(this).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
    });

    $('.container-wrapper').on("scroll", function(){
        $(animateFadeIn).each(function(){
            $(this).delay(300).animate({ opacity: 1 }, 2000, 'easeOutExpo');
        });
        $(animateFadeInUp).each(function(){
            $(this).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
        });
        $(animateFadeInDown).each(function(){
            $(this).delay(300).animate({ top: '0', opacity: 1 }, 2000, 'easeOutExpo');
        });
        $(animateFadeInLeft).each(function(){
            $(this).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
        });
        $(animateFadeInRight).each(function(){
            $(this).delay(300).animate({ left: '0', opacity: 1 }, 2000, 'easeOutExpo');
        });
    });

}

function initFullPage(){
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
    // ===== jQuery Fullpage Settings ===== //
    var fullPage  = $('#fullpage');
    var customScroll = true;  // ===== CHANGE THIS VARIABLE TO 'true' IF YOU NEED TO USE AUTO SCROLLING FUNCTION ===== //

    if (customScroll === false) {
        fullPage.addClass("normalScroll");
    }

    fullPage.fullpage({
        autoScrolling: customScroll,
        scrollOverflow: customScroll,
        resize: false,
        anchors: ['panelBlock1', 'panelBlock2', 'panelBlock3', 'panelBlock4', 'panelBlock5', 'panelBlock6', 'panelBlock7'],
        menu: '.nav-menu',
        navigation: true,
        navigationPosition: 'right',
        slidesNavigation: true,
        loopHorizontal: true,
        //responsive: 900,
        afterLoad: function(anchorLink, index){
            if(index === 2){
                $('.panel-2 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-2 .animate-fadeInUp, .panel-2 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-2 .animate-fadeInLeft, .panel-2 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 3){
                $('.panel-3 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-3 .animate-fadeInUp, .panel-3 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-3 .animate-fadeInLeft, .panel-3 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 4){
                $('.panel-4 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-4 .animate-fadeInUp, .panel-4 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-4 .animate-fadeInLeft, .panel-4 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 5){
                $('.panel-5 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-5 .animate-fadeInUp, .panel-5 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-5 .animate-fadeInLeft, .panel-5 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 6){
                $('.panel-6 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-6 .animate-fadeInUp, .panel-6 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-6 .animate-fadeInLeft, .panel-6 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 7){
                $('.panel-7 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-7 .animate-fadeInUp, .panel-7 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-7 .animate-fadeInLeft, .panel-7 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 8){
                $('.panel-8 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-8 .animate-fadeInUp, .panel-8 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-8 .animate-fadeInLeft, .panel-8 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 9){
                $('.panel-9 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-9 .animate-fadeInUp, .panel-9 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-9 .animate-fadeInLeft, .panel-9 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
            if(index === 10){
                $('.panel-10 .animate-fadeIn').animate({ opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-10 .animate-fadeInUp, .panel-10 .animate-fadeInDown').animate({ top: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $('.panel-10 .animate-fadeInLeft, .panel-10 .animate-fadeInRight').animate({ left: '0', opacity: 1 }, 1500, 'easeOutExpo');
                $(progressBar).each(function(){
                    loadDaBars();
                });
            }
        }
    });
}

function menuOpen(){
    $('html').addClass('menu-visible');
    $('#main-menu').animate({ opacity: 1, left: 30 }, 1000, 'easeOutExpo');
}

function menuClose(){
    $('html').removeClass('menu-visible');
    $('#main-menu').animate({ opacity: 0, left: -280 }, 1500, 'easeOutExpo');

}


$.getJSON("config.json", function (res) {
    $('.logo-title').html(res.siteTitle);
    $('.logo-subtitle').html(res.siteSubTitle);

    $(".video-caption h1").html(res.siteTitle);
    $(".video-caption div").html(res.siteSubTitle);
    $(".copyright a").html(res.siteTitle);
    $("head title").html(res.siteTitle);

    $('.home-contact-panel .block-title h1').html(res.contact.title);
    $('.panel-youtube .block-title h1').html(res.youtube.title);
    $('.panel-twitter .block-title h1').html(res.twitter.title);
    $('.panel-instagram .block-title h1').html(res.instagram.title);

    $('.panel-youtube .more-item-link a').html(res.youtube.moreText).attr('href', res.youtube.moreLink);
    $('.panel-twitter .more-item-link a').html(res.twitter.moreText).attr('href', res.twitter.moreLink);
    $('.panel-instagram .more-item-link a').html(res.instagram.moreText).attr('href', res.instagram.moreLink);


    $('label[for="name"]').html(res.contact.formFields.name);
    $('label[for="email"]').html(res.contact.formFields.email);
    $('label[for="mysubject"]').html(res.contact.formFields.mysubject);
    $('label[for="mymessage"]').html(res.contact.formFields.mymessage);
    $('#submit_message').val(res.contact.formFields.submit);
    sendmailMethod = res.contact.action;
    sendmailURL = res.contact.url;
    successMessage = res.contact.successMessage;

    $('.footer-description').html(res.footer.title.part1 + ' <span data-color="#00acc1">' + res.footer.title.part2 + '</span> ' + res.footer.title.part3);
    $('.footer-subdescription').html(res.footer.subtitle);

    $('#personalPhoto').append(`<figure>
<img src="${res.about.photo}" alt="image" />
</figure>`);

    $.get(res.about.text, function(response){
        var about = $('#about');
        about.html('<h2>' + res.about.title + '</h2>' + response);
        if(res.about.moreLink && res.about.moreText){
            about.append(`<div data-height="23"></div>
                        <div class="button raised blue ripple">
                            <a href="${res.about.moreLink}">${res.about.moreText}</a>
                        </div>`);
        }
    });

    function initInstagramWidget(){
        var instagramPanel = $('#instagramTabs').empty();
        $.get(res.instagram.widget, function(response){
            instagramPanel.html(response);
        });
    }


    if (res.twitter) {
        $('body').append(`<div id="twitterTimeline">
<a class="twitter-timeline" data-tweet-limit="3"
   href="https://twitter.com/${res.twitter.account}">
    Tweets by @${res.twitter.account}
</a>
</div>`);
    }

    initYoutubeBackground(res.youtubeBackgroundVideo, res.youtubeVideoStart, res.youtubeVideoEnd);
    loadVids(res.youtube.playlists);
    if(res.instagram.accessToken && res.instagram.userId) {
        initInstagramAPI(res.instagram.userId, res.instagram.accessToken);
    }else{
        initInstagramWidget();
    }
    fitImg();
    initSectionHeaders();
    buildMenu(res.menu);
    setDataColors();
    setDataHeight();
    setDataBgColor();
    setDataBackground();
    setDataOpacity();
    initAnimations();
    initFullPage();
});


jQuery(document).ready(function() {

    "use strict";

    $('.nav-open').midnight();
    $('.nav-close').midnight();

    let menu = $('#nav-btn'),
        body = $('html');

    menu.click(function() {
        if (body.hasClass('menu-visible')) {
            menuClose();
        } else {
            body.addClass('menu-visible');
            menuOpen();
        }
    });

    // ===== Pre Loader ===== //
    $(window).on("load", function(){
        $('.loader-wrapper').fadeOut(300);
       // $('#main-menu').fadeIn(300);
    });

    // ===== Add class to Text Number ===== //
    $('.number').html(function(i, v){
        return v.replace(/(\d)/g, '<span class="font-number">$1</span>');
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
    //var buildScroll = $('.nav-inner-wrap, .container-wrapper');
    var destroyScroll = $('');

    destroyScroll.slimScroll({  // ===== CHANGE 'destroyScroll' TO 'buildScroll' WHEN YOU USING AUTO SCROLLING FUNCTION ===== //
        position: 'right'
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

    // Fit Height Elements
    $(window).on("load resize", function() {
        var fitHeight = $(window).height();
        var slideHeight = $('.slider-panel-wrapper .slides li');
        slideHeight.height(fitHeight);
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
            var anchor = $('[data-anchor="' + destiny + '"]');
            var section = anchor.length ? anchor : $('.panel-1');
            if (fullPageContainer.hasClass("addAutoScroll")) {
                $.fn.fullpage.reBuild();
            }
            if (fullPageContainer.hasClass("addNormalScroll")) {
                $('html, body').scrollTop(section.position().top);
            }
        }, 1000);
    });



    // Fix Auto Height tabs_container
    $(window).on("load resize", function() {
        var pHeight = $('.portfolio-detail-wrapper');
        var ptHeight = $('.portfolio-tabs').height();

        pHeight.height(ptHeight);
    });


    // ===== Form Submit Settings ===== //
    $("#submit_message").on("click", function() {
        $('#reply_message').removeClass().html('');
        var name = $("input#name");
        var regEx=/^[A-Za-z .'-]+$/;
        if (name.val() === "" || name.val() === "Name"  || !regEx.test(name.val())) {
            name.val('');
            name.focus();
            return false;
        }

        // validate Email
        var email = $("input#email");
        regEx=/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        if (email.val() === "" || email.val() === "Email" || !regEx.test(email.val())) {
            email.val('');
            email.focus();
            return false;
        }

        // validate Subject
        var mysubject = $("input#mysubject");
        regEx=/^[A-Za-z0-9 .'-]+$/;
        if (mysubject.val() === "" || mysubject.val() === "Mysubject"  || !regEx.test(mysubject.val())) {
            mysubject.val('');
            mysubject.focus();
            return false;
        }

        // validate Message
        var mymessage = $("textarea#mymessage");
        if (mymessage.val() === "" || mymessage.val() === "Mymessage" || mymessage.length < 2) {
            mymessage.val('');
            mymessage.focus();
            return false;
        }

        var dataString = 'name='+ name.val() + '&email=' + email.val() + '&mysubject='+ mysubject.val() + '&mymessage=' + mymessage.val();

        $('.loading').fadeIn(500);

        // Send form data to mailer.php
        $.ajax({
            type: "POST",
            url: "mailer.php",
            data: dataString,
            success: function() {
                $('.loading').hide();
                $('#reply_message').addClass('list3')
                    .html("<span>Mail sent successfully</span>")
                    .hide()
                    .fadeIn(1500);
                $('#form_contact')[0].reset();
            }
        });
        return false;
    });

});