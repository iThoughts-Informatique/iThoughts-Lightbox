(function($){
	function startLightboxCatch(e){
		e.preventDefault();
		e.stopPropagation();
		startLightbox($(this), $);
	}
	ithoughts_lightbox.images = $('[data-lightbox="true"]');
	var ithoughts_lightbox_opened = false;
	ithoughts_lightbox.images.filter("img").click(startLightboxCatch);

	var $container;

	if(typeof ithoughts_tt_gl != "undefined" && ithoughts_tt_gl){
		window.appendTooltipLightbox = function($elem, $){
			var relatedSpan = $('[aria-describedby="' + $elem.parent().parent()[0].id + '"]');
			ithoughts_lightbox.images[ithoughts_lightbox.images.index(relatedSpan)] = $elem[0];
		}

		if(!ithoughts_tt_gl.qtip_filters)
			ithoughts_tt_gl.qtip_filters = {};
		if(!ithoughts_tt_gl.qtip_filters.mediatip)
			ithoughts_tt_gl.qtip_filters.mediatip = [];
		ithoughts_tt_gl.qtip_filters.mediatip.push(function($spanElem){
			var spanElem = $spanElem[0];
			if(spanElem.getAttribute("data-lightbox") == "true")
				return {
					"data-lightbox": true,
					"onclick": 'startLightbox(jQuery(this), jQuery);',
					"onload": 'window.appendTooltipLightbox(jQuery(this), jQuery);',
					"data-lightbox-fullwidth": spanElem.getAttribute("data-mediatip-image")
				};
			else
				return {};
		})
	}
})(jQuery);
function startLightbox($elem, $){
	ithoughts_lightbox_opened = true;
	var title = $elem[0].getAttribute("title")
	if(typeof title == "undefined" || !title)
		title = $elem[0].getAttribute("alt");
	if(typeof title == "undefined" || !title)
		title = "";

	var checkZoom;
	$(window).bind("resize", checkZoom);
	var caption = findClosestCaption($elem);
	if(caption){
		caption = "<p class=\"ithoughts_lightbox-caption\">" + caption + "</p>";
	} else {
		caption = "";
	}

	$lightbox = $($.parseHTML('\
<div id="ithoughts_lightbox-lightboxContainer" class="' + ithoughts_lightbox.theme + '">\
<div id="ithoughts_lightbox-lightboxSubContainer">\
<div id="ithoughts_lightbox-header">\
<h2>' + title + '</h2>\
<button id="ithoughts_lightbox-header-close">&times;</button>\
' + (ithoughts_lightbox.zoom == "1" ? '<button id="ithoughts_lightbox-header-zoom" class="ithoughts-lightbox-hidden"><svg viewbox="0 0 32 32"><use xlink:href="'+ithoughts_lightbox.baseurl+'/js/icon/lens.svg#lens"></use></svg></button>' : '') + '\
</div>\
<div id="ithoughts_lightbox-subContainer">\
<div id="ithoughts_lightbox-captionContainer">\
' + caption + '\
</div>\
<button class="ithoughts_lightbox-left">&lt;</button>\
<div id="ithoughts_lightbox-container">\
</div>\
<button class="ithoughts_lightbox-right">&gt;</button>\
</div>\
<div id="ithoughts_lightbox-loader" data-loader-status="shown">\
<div class="loader"></div>\
</div>\
</div>\
</div>')).css("opacity",0).animate({opacity: 1}, 500);
	$("body").append($lightbox);
	loader = $lightbox.find("#ithoughts_lightbox-loader")[0];
	$lightboxSub = $lightbox.find("#ithoughts_lightbox-lightboxSubContainer");
	$lightboxHeader = $lightbox.find("#ithoughts_lightbox-header")
	if(window.chrome && /android/i.test(navigator.userAgent)){
		$(window).resize(function(){
			$lightboxSub.stop().animate({height: $(window).height()});
		});
	}
	var buttons = {
		right: $lightbox.find(".ithoughts_lightbox-right"),
		left: $lightbox.find(".ithoughts_lightbox-left"),
		close: $lightbox.find("#ithoughts_lightbox-header-close"),
		zoom: $lightbox.find("#ithoughts_lightbox-header-zoom")
	};
	var rotate;
	var index = ithoughts_lightbox.images.index($elem);
	var zoomObj = null;

	//Hide switch buttons if needed
	if(ithoughts_lightbox.images.length < 2){
		buttons.right.addClass("ithoughts-lightbox-hidden");
		buttons.left.addClass("ithoughts-lightbox-hidden");
	} else {
		if(ithoughts_lightbox.loopbox === "1"){ // Loopbox, both directions are available
			rotate = function(indexIncrement){
				var l = ithoughts_lightbox.images.length;
				index += indexIncrement;
				index = (l + index) % l;
				return index;
			};
		} else {
			rotate = function(indexIncrement){
				index += indexIncrement;
				buttons.right.stop().removeClass("ithoughts-lightbox-hidden");
				buttons.left.stop().removeClass("ithoughts-lightbox-hidden");
				if(index <= 0){
					index = 0;
					buttons.left.stop().addClass("ithoughts-lightbox-hidden");
				}
				else if(index >= ithoughts_lightbox.images.length - 1){
					index = ithoughts_lightbox.images.length - 1;
					buttons.right.stop().addClass("ithoughts-lightbox-hidden");
				}
				return index;
			};
			if(index === 0){
				buttons.left.addClass("ithoughts-lightbox-hidden");
			} else if(index === ithoughts_lightbox.images.length - 1){
				buttons.right.addClass("ithoughts-lightbox-hidden");
			}
		}
	}
	buttons.right.click(function(){
		var oldIndex = index;
		var newIndex = rotate(1);
		if(oldIndex != newIndex)
			executeRotateToImage(newIndex);
	});
	buttons.left.click(function(){
		var oldIndex = index;
		var newIndex = rotate(-1);
		if(oldIndex != newIndex)
			executeRotateToImage(newIndex);
	});
	buttons.zoom.click(function(){
		if($(this).prop("disabled") != "disabled"){
			if(zoomObj == null){
				setMode({zoom: true});
				zoomObj = new ZoomableImage($container.find(".ithoughts_lightbox-img"), {maxZoom: ithoughts_lightbox.maxZoomLevel});
				$header.bind("mouseover mouseleave", delayRecalcZoom);
			} else {
				setMode({zoom: false});
				$header.unbind("mouseover mouseleave", delayRecalcZoom);
				zoomObj.delete();
				zoomObj = null;
			}
		} else {
			throw "That should not happen: click on disabled zoom button";
		}
	});
	function delayRecalcZoom(){
		setTimeout(zoomObj.recalcDimensions, 500);
	}
	function setMode(mode){
		if(typeof mode != "undefined"){
			if(typeof mode.zoom != "undefined" && mode.zoom != null){
				if(mode.zoom){
					$lightboxHeader.addClass("pseudo-hover");
					$lightboxCaptionContainer.hide();
					buttons.right.addClass("ithoughts-lightbox-hidden");
					buttons.left.addClass("ithoughts-lightbox-hidden");
				} else {
					$lightboxHeader.removeClass("pseudo-hover");
					$lightboxCaptionContainer.show();
					buttons.right.removeClass("ithoughts-lightbox-hidden");
					buttons.left.removeClass("ithoughts-lightbox-hidden");
				}
			}
		}
	}

	var $container = $lightbox.find("#ithoughts_lightbox-container");
	$container.append(loadImage($elem[0].getAttribute("data-lightbox-fullwidth") || $elem[0].getAttribute("src")));
	var $header = $lightbox.find("#ithoughts_lightbox-header h2");
	var $lightboxCaptionContainer = $lightbox.find("#ithoughts_lightbox-captionContainer");
	buttons.close.click(function(e){closeLightbox(e, false)});
	window.onbeforeunload = function(e){closeLightbox(e, true)};
	window.onkeydown = function(e){
		if(e.keyCode == 27)
			closeLightbox(e, false);
	};

	function closeLightbox(event, isRefresh){
		if(ithoughts_lightbox_opened){
			$(window).unbind("resize", checkZoom);
			ithoughts_lightbox_opened = false;
			$lightbox.find("#ithoughts_lightbox-header").addClass("closing");
			$lightbox.animate({opacity:0}, 500, function(){
				$lightbox.remove();
			});
			return false;
		}
	}

	function loadImage(imageurl){
		loader.setAttribute('data-loader-status', "shown");
		return $($.parseHTML('<img onload="jQuery(this).show();" style="display:none;" class="ithoughts_lightbox-img" src="' + imageurl + '">')).css("opacity", 0).load(function(){
			var Self = this;
			$(window).unbind("resize", checkZoom);
			checkZoom = (function(){
				var self = Self;
				return function(){
					if(ithoughts_lightbox.zoom){
						var overflowed = false;
						if(!self.naturalWidth || !self.naturalHeight) {
							console.warn("Can't get natural dimensions of url image " + imageurl + ". Maybe the browser is too old?");
						} else {
							if(self.naturalHeight > self.height){
								overflowed = true;
							}
							if(self.naturalWidth > self.width){
								overflowed = true;
							}
						}
						if(overflowed){
							buttons.zoom.prop("disabled", false	).removeClass("ithoughts-lightbox-hidden");	
						} else {
							buttons.zoom.prop("disabled", "disabled").addClass("ithoughts-lightbox-hidden");
						}
					}
				}
			})();
			checkZoom();
			$(window).bind("resize", checkZoom);
			loader.setAttribute('data-loader-status', "hidden");
			$(this).stop().animate({opacity:1});
		});
	}
	function findClosestCaption($image, depth){
		if(typeof depth == "undefined")
			depth = 2;
		var searchedParent = $image;
		for(var i = 0; i < 2; i++)
			searchedParent = searchedParent.parent();
		var res = searchedParent.find('.wp-caption-text');
		if(res.length == 0)
			res = searchedParent.find('[class*="caption"]');
		return (typeof res != "undefined" && res && res.length) ? res[0].innerHTML : null;
	}
	var executeRotateToImage = (function(){
		switch(ithoughts_lightbox.transition){
			case "fade":{
				return function(imageIndex){
					if(zoomObj != null){
						zoomObj.delete();
						zoomObj = null;
					}
					setMode({zoom: false});
					//ithoughts_lightbox.startTransition = function(newImg){
					var newImg = $(ithoughts_lightbox.images[imageIndex]);

					// Header
					$lightboxHeader.find("h2").animate({opacity: 0}, ithoughts_lightbox.duration, function(){
						$(this).remove();
					});
					var title = newImg[0].getAttribute("title")
					if(typeof title == "undefined" || !title)
						title = newImg[0].getAttribute("alt");
					if(typeof title == "undefined" || !title)
						title = "";
					$lightboxHeader.prepend($($.parseHTML("<h2 style=\"opacity: 0\">" + title + "</h2>")).animate({opacity: 1}, ithoughts_lightbox.duration));

					//Caption (if any)
					var caption = findClosestCaption($(ithoughts_lightbox.images[imageIndex]));
					$lightboxCaptionContainer.find(".ithoughts_lightbox-caption").animate({opacity: 0}, ithoughts_lightbox.duration, function(){
						$(this).remove();
					});
					if(caption){
						$lightboxCaptionContainer.append($($.parseHTML("<p class=\"ithoughts_lightbox-caption\" style=\"opacity: 0\">" + caption + "</p>")).animate({opacity: 1}, ithoughts_lightbox.duration));

					}

					// Image
					$container.children().not(newImg).animate({opacity: 0}, ithoughts_lightbox.duration, function(){
						$(this).remove();
					});
					newImg.animate({opacity: 1}, ithoughts_lightbox.duration);
					//}
					var copyAttributes = ["alt", "title"];
					var newElem = loadImage(ithoughts_lightbox.images[imageIndex].getAttribute("data-lightbox-fullwidth"))[0];
					for(var i = 0; i < copyAttributes.length; i++){
						var attr = ithoughts_lightbox.images[imageIndex].getAttribute(copyAttributes[i]);
						if(typeof attr != "undefined" && attr)
							newElem.setAttribute(copyAttributes[i], attr);
					}
					$container.append(newElem);
				}
			} break;
		}
	})();
}