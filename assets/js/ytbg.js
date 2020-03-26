/* Youtube Vars---------------------------------------------------------------*/
var yt_video = "6iuNSa4lJoA";
var v_start = 20;

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
    videoStartTime = 0;
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
        tv.playVideo();
    }
}

(function(){

    'use strict';

    $(function(){

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
            vmVidRescale();
            ytVidRescale();
        }

        function ytVidRescale(){
            if(typeof yt_video !== "undefined"){
                if(yt_video!==undefined && yt_video!=="" && yt_video!==" "){
                    var c = setInterval(function(){
                        var w = $(".hero-video").width()+200,
                            h = $(".hero-video").height()+200;
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

        function vmVidRescale(){
            if(typeof vm_video !== "undefined"){
                if(vm_video!==undefined && vm_video!=="" && vm_video!==" "){
                    var c = setInterval(function(){
                        var theWidth = $(".hero-video").width();
                        var theHeight = $(".hero-video").height();
                        var newWidth = (theHeight*1.77777778);
                        var newHeight = (theWidth/1.77777778);
                        if ( (theWidth > 1280) && (newHeight > theHeight )) {
                            $('.fullvid').css({'width':theWidth+5, 'height':newHeight+5});
                        }
                        if ( (theHeight > 720) && (newWidth > theWidth )) {
                            $('.fullvid').css({'height':theHeight+5, 'width':newWidth+5});
                        }
                    },1);
                    if($(".hero-video").css("opacity")==="0"){
                        $(".hero-video").css("opacity","0.01");
                        $(".hero-video").stop().delay(2000).animate({opacity:1},{duration:3000});
                    }
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