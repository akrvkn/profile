/**
 * Video background
 *
 */
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

/**** Video background polyfill *****/
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

/****** End video background *****/


/**
 * Instagram API
 */
function initInstagramWidget(widget){
    var instagramPanel = $('#instagramTabs').empty();
    $.get(widget, function(response){
        instagramPanel.html(response);
    });
}

function initInstagramAPI(token) {
    var feed = new Instafeed({
        accessToken: token,
        limit: 8,
        mock: true,
        success: readInstaData
    });
    feed.run();
}

function readInstaData(response) {
    //var that = this;
    $.each(response.data, function(i, photo) {
        //var k = i + 1;
        if( i < 9) {
            $('.portfolio-tabs-list').append(createPhotoElement(i, photo));
            $('.portfolio-detail-wrapper').append(createPhotoBig(i, photo));
        }
        if(i === 8){
            $('#instagramTabs').tabulous({
                effect: 'slideUp' //** This Template use effect slideUp only for the proper design.
            });
            setTabsHeight();
        }
    });
}

function createPhotoElement(k, photo) {

    var innerHtml = $('<img src="" alt="img">')
        .attr('src', photo.media_url);
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
    //var tags = photo.tags.length === 0 ? '#' + photo.user.username : photo.tags.toString().replace(',', '#');
    return `<div id="portfolio-tabs-${k}" class="portfolio-tabs">
                    <figure class="portfolio-tabs-img">
                        <img src="${photo.media_url}" width="640" height="640" alt="portfolio" />
                    </figure>
                    <section class="portfolio-tabs-detail">
                        <h2>@${photo.username}</h2>
                        <div class="item-list-description">${photo.caption} <a href="${photo.permalink}"> [...]</a></div>                      
                    </section>
                </div>`;
}

function setTabsHeight(){
    var pHeight = $('.portfolio-detail-wrapper');
    var ptHeight = $('.portfolio-tabs').height();

    pHeight.height(ptHeight);
}

function loadSectionFromURL(){
    //console.log(window.location.hash);
    var page =  window.location.hash.replace('#', '');
    if(page) {
        $.fn.pagepiling.moveTo(page);
    }
}

function setDataBackground() {
    var bgImage = ".section"
    $(bgImage).css('background-image', function () {
        var bg = '';
        if(typeof  $(this).data("image-src") !== "undefined" ) {
            bg = ('url(data:image/svg+xml;base64,' + btoa($(this).data("image-src")) + ')');
        }
        return bg;
    });
}

function setDataBgColor() {
    $("*").css('background-color', function () {
        return $(this).data('bg-color');
    });
}

function mainVid(id) {
    $('.videoWrapper').html(`
            <iframe width="1280" height="750" src="https://www.youtube.com/embed/videoseries?list=${id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        `);
}

function resultsLoop(data) {

    $.each(data, function (i, item) {
        $('#video-thumb').append(`
                    <div class="swiper-slide" data-key="${item.id}">
                        <div class="carousel-inner">
                            <div class="youtube-thumb-overlay"></div>
                            <iframe width="100%" height="150"  src="https://www.youtube.com/embed/videoseries?list=${item.id}" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            <div class="content-block-detail">                                  
                                <h3">${item.title}</h3>                                
                            </div>                        
                        </div>
                    </div>
                `);
    });
}

function loadVids(data) {
    var id = data[0].id;
    mainVid(id);
    resultsLoop(data);
    var swiper = new Swiper('#ytSlider', {
        slidesPerView: 1,
        spaceBetween: 10,
        // init: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            360: {
                slidesPerView: 1,
                spaceBetween: 0,
            },
            480: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        }
    });
}


function parseTwitterData(id){
    var twitterBlog = $('#twitterBlog');
    var timeline = $('#' + id).contents().find('ol li.timeline-TweetList-tweet');
    $.each(timeline, function (i, v) {
        var text = $(v).find('.timeline-Tweet-text').text();
        var avatar = $(v).find('.Avatar').attr('src');
        var media = $(v).find('.NaturalImage-image').attr('src');
        var time = $(v).find('time').text();
        var link = $(v).find('a.timeline-Tweet-timestamp').attr('href');
        var name = $(v).find('.TweetAuthor-screenName').text();
        var title = $(v).find('.TweetAuthor-name').text();
        twitterBlog.append(createTwitterTweet(text, media, avatar, time, link, name, title));
        if(i === timeline.length - 1) {
            twitterBlog.slick({
                vertical: true,
                verticalSwiping: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            });
            $('.next-review-btn').click(function () {
                $('#twitterBlog').slick('slickNext');
            });
            $('.prev-review-btn').click(function () {
                $('#twitterBlog').slick('slickPrev');
            });
        }
    });
}

function createTwitterTweet(txt, pic, avatar, time, link, name, title){
    var	img = pic === undefined ? '' : `<p><a style="cursor: pointer;" data-fancybox href="${pic.split('&')[0] + '&name=small'}"><img src="${pic.split('&')[0] + '&name=small'}"  class="user-pic" alt="thumbnail" /></a></p>`;
    return `<div class="tw-items item">
            <div class="tw-body">
               
                <p class="user-comment">${txt}</p>
                <p class="comment-date">${time}</p>
                ${img}
                <p class="comment-date"><a href="${link}">Open</a></p>
            </div>
            <div class="user-img"><img src="${avatar}" width="48" height="48" class="rounded-circle" alt="img"></div>
            <h4 class="user-name">${name}</h4>
            <p class="user-designation">- ${title} -</p>
         </div>`;
}

$(document).ready(function() {
    $.getJSON("/config.json", function (res) {
        initConfig(res);
    });

    $('#video-thumb').on('click', '.swiper-slide', function () {
        var id = $(this).attr('data-key');
        $( ".video-main" ).animate({
            opacity: 0
        }, 500, function() {
            // Animation complete.
            mainVid(id);
            $( ".video-main" ).animate({
                opacity: 1
            }, 500);
        });

    });
    /*var swiperYT = new Swiper('#ytSlider', {
        slidesPerView: 1,
        spaceBetween: 10,
        // init: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1024: {
                slidesPerView: 5,
                spaceBetween: 50,
            },
        }
    });*/

    $('.morphing-menu a').on('click', function(){
        $('.morphing-menu input').prop('checked', false);
    });
    $('#video-thumb').on('click', '.carousel-item', function () {
        var id = $(this).attr('data-key');
        mainVid(id);
    });

});

function initPagePiling(res){
    $('#pagepiling').pagepiling({
        menu: '.nav-menu',
        direction: 'vertical',
        verticalCentered: true,
        sectionsColor: ['#474747', '#ffffff', 'red', 'rgba(29,161,242,1.00)', '#cd2e89'],
        anchors: ['section1', 'section2', 'section3', 'section4', 'section5'],
        scrollingSpeed: 700,
        easing: 'swing',
        loopBottom: false,
        loopTop: false,
        css3: true,
        navigation: {
            'textColor': '#ffffff',
            'bulletsColor': '#ffffff',
            'position': 'right'
        },
        normalScrollElements: null,
        normalScrollElementTouchThreshold: 5,
        touchSensitivity: 5,
        keyboardScrolling: true,
        sectionSelector: '.section',
        animateAnchor: false,

        //events
        onLeave: function(index, nextIndex, direction){},
        afterLoad: function(anchorLink, index){},
        afterRender: function(){
            loadSectionFromURL();
        },
    });
}

function initTwitterAPI(res){
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
    $('body').append(`<div id="twitterTimeline" class="timeline">
                <a class="twitter-timeline" data-tweet-limit="9"
                   href="https://twitter.com/${res.twitter.account}">
                    Tweets by @${res.twitter.account}
                </a>
            </div>`);
}

function initConfig(res){
    //setDataBgColor();
    initYoutubeBackground(res.youtubeBackgroundVideo, res.youtubeVideoStart, res.youtubeVideoEnd);
    initPagePiling(res);
    setDataBackground();
    $('#video-thumb').empty();
    loadVids(res.youtube.playlists);
    if(res.instagram.accessToken) {
        initInstagramAPI(res.instagram.accessToken);
    }else{
        initInstagramWidget();
    }
    if (res.twitter) {
        initTwitterAPI(res);
    }
}


(function($,sr){

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

$(function() {

    // Find all YouTube videos
    var $allVideos = $(".video-main iframe"),

        // The element that is fluid width
        $fluidEl = $(".video-main");

    // Figure out and save aspect ratio for each video
    $allVideos.each(function() {
        //console.log( this.height, this.width );
        var aspectRatio = parseInt(this.height) / parseInt(this.width);
        $(this)
            .data('aspectRatio', aspectRatio)

            // and remove the hard coded width/height
            .removeAttr('height')
            .removeAttr('width');

    });

    // When the window is resized
    // (You'll probably want to debounce this)
    $(window).smartresize(function(){

        var newWidth = $fluidEl.width();

        // Resize all videos according to their own aspect ratio
        $allVideos.each(function() {

            var $el = $(this);
            $el
                .width(newWidth)
                .height(newWidth * $el.data('aspectRatio'));

        });

        // Kick off one resize to fix all videos on page load
    }).smartresize();

});


